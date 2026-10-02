<?php

namespace App\Http\Controllers;

use App\Models\Izin;
use App\Models\Presensi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class IzinController extends Controller
{
    /**
     * Display user's izin requests
     */
    public function index()
    {
        $user = Auth::user();

        $izins = Izin::forUser($user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('presensi/izin/index', [
            'izins' => $izins,
        ]);
    }

    /**
     * Show form to create izin
     */
    public function create()
    {
        return Inertia::render('presensi/izin/create');
    }

    /**
     * Store new izin request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipe' => 'required|in:izin,cuti,sakit,dinas',
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'alasan' => 'required|string|max:500',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'pending';

        Izin::create($validated);

        return redirect()->route('izin.index')
            ->with('success', 'Permohonan izin berhasil diajukan');
    }

    /**
     * Cancel izin request (only if pending)
     */
    public function cancel(Izin $izin)
    {
        if ($izin->user_id !== Auth::id()) {
            abort(403);
        }

        if ($izin->status !== 'pending') {
            return redirect()->back()->with('error', 'Izin sudah diproses, tidak dapat dibatalkan');
        }

        $izin->delete();

        return redirect()->route('izin.index')
            ->with('success', 'Permohonan izin berhasil dibatalkan');
    }

    /**
     * Admin: List all izin requests
     */
    public function adminIndex(Request $request)
    {
        $query = Izin::with(['user']);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by user
        if ($request->user_id) {
            $query->forUser($request->user_id);
        }

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->where(function($q) use ($request) {
                $q->whereBetween('tanggal_mulai', [$request->start_date, $request->end_date])
                  ->orWhereBetween('tanggal_selesai', [$request->start_date, $request->end_date]);
            });
        }

        $izins = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        $users = User::orderBy('name')->get();

        return Inertia::render('izin/admin/Index', [
            'izins' => $izins,
            'users' => $users,
            'filters' => $request->only(['status', 'user_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Admin: Approve izin
     */
    public function approve(Request $request, Izin $izin)
    {
        $validated = $request->validate([
            'catatan_approval' => 'nullable|string|max:500',
        ]);

        $izin->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => Carbon::now(),
            'catatan_approval' => $validated['catatan_approval'] ?? null,
        ]);

        // Update presensi records for affected dates
        $dates = $izin->getDateRange();
        foreach ($dates as $date) {
            $tipePresensi = $izin->tipe === 'sakit' ? 'izin' : $izin->tipe;

            Presensi::updateOrCreate(
                ['user_id' => $izin->user_id, 'tanggal' => $date],
                ['status' => $tipePresensi, 'keterangan' => "Approved: {$izin->alasan}"]
            );
        }

        return redirect()->back()->with('success', 'Izin berhasil disetujui');
    }

    /**
     * Admin: Reject izin
     */
    public function reject(Request $request, Izin $izin)
    {
        $validated = $request->validate([
            'catatan_approval' => 'nullable|string|max:500',
        ]);

        $izin->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => Carbon::now(),
            'catatan_approval' => $validated['catatan_approval'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Izin berhasil ditolak');
    }
}

