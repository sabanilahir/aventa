<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display user's schedule calendar
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $bulan = $request->get('bulan', Carbon::now()->month - 1);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $startDate = Carbon::create($tahun, $bulan + 1, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $schedules = Schedule::forUser($user->id)
            ->dateRange($startDate, $endDate)
            ->with('shift')
            ->orderBy('tanggal')
            ->get();

        $defaultShift = $user->shift_id ? Shift::find($user->shift_id) : null;

        return Inertia::render('schedule/index', [
            'schedules' => $schedules,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'shiftSaya' => $defaultShift,
        ]);
    }

    /**
     * Admin: Display schedule management page
     */
    public function adminIndex(Request $request)
    {
        $query = Schedule::with(['user', 'shift']);

        // Filter by user
        if ($request->user_id) {
            $query->forUser($request->user_id);
        }

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        $schedules = $query->orderBy('tanggal', 'desc')
            ->paginate($request->get('per_page', 15));

        $users = User::orderBy('name')->get();
        $shifts = Shift::active()->get();

        return Inertia::render('presensi/schedule/admin/index', [
            'schedules' => $schedules,
            'users' => $users,
            'shifts' => $shifts,
            'filters' => $request->only(['user_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Store or update schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tanggal' => 'required|date',
            'shift_id' => 'required_without:is_off|exists:shifts,id',
            'is_off' => 'boolean',
            'keterangan' => 'nullable|string|max:255',
        ]);

        Schedule::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'tanggal' => $validated['tanggal'],
            ],
            [
                'shift_id' => $validated['is_off'] ? null : $validated['shift_id'],
                'is_off' => $validated['is_off'] ?? false,
                'keterangan' => $validated['keterangan'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Jadwal berhasil disimpan');
    }

    /**
     * Bulk create schedules (for month)
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'shift_id' => 'required|exists:shifts,id',
        ]);

        $userId = $validated['user_id'];
        $shiftId = $validated['shift_id'];
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        $current = $startDate->copy();
        $count = 0;

        while ($current->lte($endDate)) {
            Schedule::updateOrCreate(
                [
                    'user_id' => $userId,
                    'tanggal' => $current->format('Y-m-d'),
                ],
                [
                    'shift_id' => $shiftId,
                    'is_off' => false,
                ]
            );
            $count++;
            $current->addDay();
        }

        return redirect()->back()->with('success', "Jadwal berhasil dibuat untuk {$count} hari");
    }

    /**
     * Delete schedule
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->back()->with('success', 'Jadwal berhasil dihapus');
    }

    /**
     * Generate default schedule for user (Monday-Friday with selected shift)
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $userId = $validated['user_id'];
        $shiftId = $validated['shift_id'];
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        $current = $startDate->copy();
        $count = 0;

        while ($current->lte($endDate)) {
            // Only weekdays (Monday = 1, Friday = 5)
            if ($current->dayOfWeek >= 1 && $current->dayOfWeek <= 5) {
                Schedule::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'tanggal' => $current->format('Y-m-d'),
                    ],
                    [
                        'shift_id' => $shiftId,
                        'is_off' => false,
                    ]
                );
                $count++;
            }
            $current->addDay();
        }

        return redirect()->back()->with('success', "Jadwal weekday berhasil dibuat untuk {$count} hari");
    }
}

