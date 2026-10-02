<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Izin;
use App\Models\Shift;
use App\Models\Location;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class PresensiController extends Controller
{
    /**
     * Display dashboard presensi
     */
    public function index()
    {
        $user = Auth::user();
        $today = Carbon::today();

        // Get today's attendance status
        $todayPresensi = Presensi::forUser($user->id)
            ->today()
            ->with(['shift', 'location'])
            ->first();

        // Get user's schedule for today
        $todaySchedule = Schedule::getTodayForUser($user->id);

        // Check if user has approved leave today
        $todayIzin = Izin::forUser($user->id)
            ->approved()
            ->whereDate('tanggal_mulai', '<=', $today)
            ->whereDate('tanggal_selesai', '>=', $today)
            ->first();

        // Get recent attendance history
        $recentPresensi = Presensi::forUser($user->id)
            ->orderBy('tanggal', 'desc')
            ->with(['shift'])
            ->limit(7)
            ->get();

        // Statistics
        $stats = [
            'total_hadir' => Presensi::forUser($user->id)
                ->where('status', 'hadir')
                ->whereMonth('tanggal', $today->month)
                ->whereYear('tanggal', $today->year)
                ->count(),
            'total_terlambat' => Presensi::forUser($user->id)
                ->where('status', 'terlambat')
                ->whereMonth('tanggal', $today->month)
                ->whereYear('tanggal', $today->year)
                ->count(),
            'total_izin' => Izin::forUser($user->id)
                ->approved()
                ->whereMonth('tanggal_mulai', '<=', $today)
                ->whereMonth('tanggal_selesai', '>=', $today)
                ->count(),
        ];

        return Inertia::render('presensi/index', [
            'todayPresensi' => $todayPresensi,
            'todaySchedule' => $todaySchedule,
            'todayIzin' => $todayIzin,
            'recentPresensi' => $recentPresensi,
            'stats' => $stats,
            'faceStatus' => [
                'registered' => $user->face_registered ?? false,
                'has_descriptor' => !empty($user->face_descriptor),
            ],
        ]);
    }

    /**
     * API: Get user's attendance data
     */
    public function api(Request $request)
    {
        $user = Auth::user();
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());

        $presensis = Presensi::forUser($user->id)
            ->dateRange($startDate, $endDate)
            ->with(['shift', 'location'])
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($presensis);
    }

    /**
     * Check-in
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'foto' => 'nullable|string',
            'liveness_verified' => 'boolean',
            'face_descriptor' => 'nullable|array',
        ]);

        $user = Auth::user();
        $today = Carbon::today();
        $now = Carbon::now();

        // Check if already checked in today
        $existing = Presensi::forUser($user->id)->today()->first();
        if ($existing && $existing->jam_masuk) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan presensi masuk hari ini',
            ], 400);
        }

        // Get user's shift for today
        $schedule = Schedule::getTodayForUser($user->id);
        $shiftId = $schedule?->shift_id;
        $shift = $schedule?->shift;

        // Determine status based on shift
        $status = 'hadir';
        if ($shift && $shift->jam_masuk) {
            $shiftMasuk = Carbon::parse($shift->jam_masuk);
            if ($now->gt($shiftMasuk)) {
                $status = 'terlambat';
            }
        }

        // Step 1: Verify Location - find nearest active location
        $nearestLocation = Location::findNearest($request->latitude, $request->longitude);

        if (!$nearestLocation) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi tidak ditemukan. Pastikan Anda berada di area yang terdaftar.',
                'error_type' => 'location_not_found',
            ], 400);
        }

        // Step 2: Check if within radius
        if (!$nearestLocation->isWithinRadius($request->latitude, $request->longitude)) {
            $distance = Location::calculateDistance(
                $request->latitude,
                $request->longitude,
                $nearestLocation->latitude,
                $nearestLocation->longitude
            );
            return response()->json([
                'success' => false,
                'message' => "Anda berada di luar area presensi. Jarak: " . round($distance) . "m dari lokasi terdekat ({$nearestLocation->nama}). Maksimal: {$nearestLocation->radius}m",
                'error_type' => 'outside_radius',
                'distance' => round($distance),
                'max_radius' => $nearestLocation->radius,
            ], 400);
        }

        // Step 3: Verify Face if registered
        if ($user->face_registered) {
            // Check if liveness was verified
            if (!$request->liveness_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Verifikasi wajah diperlukan. Silakan gunakan verifikasi wajah.',
                    'error_type' => 'liveness_required',
                    'requires_face_verification' => true,
                ], 400);
            }

            // Check if face descriptor was provided
            if (!$request->face_descriptor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data wajah tidak lengkap. Silakan ambil foto ulang.',
                    'error_type' => 'descriptor_missing',
                    'requires_face_verification' => true,
                ], 400);
            }

            // Perform face matching
            $storedDescriptor = is_string($user->face_descriptor)
                ? json_decode($user->face_descriptor, true)
                : $user->face_descriptor;

            if (empty($storedDescriptor)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data wajah terdaftar tidak valid. Silakan daftar ulang wajah.',
                    'error_type' => 'invalid_stored_face',
                ], 400);
            }

            $similarity = $this->calculateFaceSimilarity($request->face_descriptor, $storedDescriptor);
            $threshold = 0.4; // Cosine similarity threshold (0 = opposite, 1 = identical)

            Log::info("Face matching: similarity = {$similarity}, threshold = {$threshold}");

            if ($similarity < $threshold) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wajah tidak cocok dengan data terdaftar. Kemiripan: ' . round($similarity * 100) . '%',
                    'error_type' => 'face_mismatch',
                ], 400);
            }
        }

        // Step 4: All validations passed - Create or update attendance record
        $presensi = Presensi::updateOrCreate(
            ['user_id' => $user->id, 'tanggal' => $today],
            [
                'jam_masuk' => $now->format('H:i:s'),
                'status' => $status,
                'shift_id' => $shiftId,
                'location_id' => $nearestLocation->id,
                'latitude_masuk' => $request->latitude,
                'longitude_masuk' => $request->longitude,
                'foto_masuk' => $request->foto,
            ]
        );

        Log::info("User {$user->id} checked in at {$presensi->jam_masuk}, status: {$status}, location: {$nearestLocation->nama}");

        return response()->json([
            'success' => true,
            'message' => $status === 'terlambat'
                ? 'Presensi masuk berhasil. Anda terlambat.'
                : 'Presensi masuk berhasil',
            'data' => $presensi->load(['shift', 'location']),
        ]);
    }

    /**
     * Calculate face similarity using cosine similarity
     * Returns value between 0 (no match) and 1 (perfect match)
     */
    private function calculateFaceSimilarity(array $descriptor1, array $descriptor2): float
    {
        if (count($descriptor1) !== count($descriptor2)) {
            Log::warning('Face descriptors have different lengths: ' . count($descriptor1) . ' vs ' . count($descriptor2));
            return 0;
        }

        $dotProduct = 0;
        $norm1 = 0;
        $norm2 = 0;

        for ($i = 0; $i < count($descriptor1); $i++) {
            $dotProduct += $descriptor1[$i] * $descriptor2[$i];
            $norm1 += $descriptor1[$i] * $descriptor1[$i];
            $norm2 += $descriptor2[$i] * $descriptor2[$i];
        }

        $norm1 = sqrt($norm1);
        $norm2 = sqrt($norm2);

        if ($norm1 == 0 || $norm2 == 0) {
            return 0;
        }

        return $dotProduct / ($norm1 * $norm2);
    }

    /**
     * Check-out
     */
    public function checkOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'foto' => 'nullable|string',
        ]);

        $user = Auth::user();
        $now = Carbon::now();

        // Get today's attendance
        $presensi = Presensi::forUser($user->id)->today()->first();

        if (!$presensi || !$presensi->jam_masuk) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum melakukan presensi masuk',
            ], 400);
        }

        if ($presensi->jam_pulang) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan presensi pulang',
            ], 400);
        }

        // Update status if leaving early
        $status = $presensi->status;
        if ($presensi->shift && $presensi->shift->jam_pulang) {
            $shiftPulang = Carbon::parse($presensi->shift->jam_pulang);
            if ($now->lt($shiftPulang)) {
                $status = 'pulang_awal';
            }
        }

        // Update attendance record
        $presensi->update([
            'jam_pulang' => $now->format('H:i:s'),
            'status' => $status,
            'latitude_pulang' => $request->latitude,
            'longitude_pulang' => $request->longitude,
            'foto_pulang' => $request->foto,
        ]);

        Log::info("User {$user->id} checked out at {$presensi->jam_pulang}");

        return response()->json([
            'success' => true,
            'message' => 'Presensi pulang berhasil',
            'data' => $presensi->fresh(['shift', 'location']),
        ]);
    }

    /**
     * Admin: List all attendance records
     */
    public function adminIndex(Request $request)
    {
        $query = Presensi::with(['user', 'shift', 'location']);

        // Filter by user
        if ($request->user_id) {
            $query->forUser($request->user_id);
        }

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $presensis = $query->orderBy('tanggal', 'desc')
            ->paginate($request->get('per_page', 15));

        $users = User::orderBy('name')->get();
        $shifts = Shift::active()->get();

        return Inertia::render('presensi/admin/index', [
            'presensis' => $presensis,
            'users' => $users,
            'shifts' => $shifts,
            'filters' => $request->only(['user_id', 'start_date', 'end_date', 'status']),
        ]);
    }

    /**
     * Admin: Export attendance to Excel
     */
    public function export(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $query = Presensi::with(['user', 'shift'])
            ->dateRange($request->start_date, $request->end_date);

        if ($request->user_id) {
            $query->forUser($request->user_id);
        }

        $presensis = $query->orderBy('tanggal')
            ->orderBy('user_id')
            ->get();

        // Generate CSV/Excel
        $filename = 'presensi_' . $request->start_date . '_' . $request->end_date . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($presensis) {
            $handle = fopen('php://output', 'w');

            // Header
            fputcsv($handle, ['No', 'Tanggal', 'Nama', 'Shift', 'Jam Masuk', 'Jam Pulang', 'Status', 'Jam Kerja', 'Keterangan']);

            foreach ($presensis as $i => $presensi) {
                fputcsv($handle, [
                    $i + 1,
                    $presensi->tanggal->format('Y-m-d'),
                    $presensi->user->name ?? '-',
                    $presensi->shift->nama ?? '-',
                    $presensi->jam_masuk ?? '-',
                    $presensi->jam_pulang ?? '-',
                    $presensi->status,
                    $presensi->work_hours . ' jam',
                    $presensi->keterangan ?? '-',
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}

