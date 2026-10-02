<?php
namespace App\Http\Controllers;
use App\Models\Acara;
use App\Models\Tamu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Acara::query();
        if ($request->search) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $events = $query->orderBy('created_at', 'desc')->get();
        return Inertia::render('events/Index', ['events' => $events]);
    }

    public function create()
    {
        return Inertia::render('events/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'tempat' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'qr_per_keluarga' => 'nullable|integer|min:1|max:10',
            'status' => 'nullable|in:draft,active,completed,archived'
        ]);
        $acara = Acara::create($data);
        return redirect()->route('events.show', $acara->id)->with('success', 'Event berhasil dibuat');
    }

    public function show($id)
    {
        $acara = Acara::findOrFail($id);
        $stats = [
            'total_tamu' => $acara->tamu()->count(),
            'total_pax' => $acara->tamu()->sum('jumlah_undangan'),
            'akan_datang' => $acara->tamu()->where('status_hadir', 'belum')->count(),
            'hadir' => $acara->tamu()->where('status_hadir', 'hadir')->count(),
            'tidak_hadir' => $acara->tamu()->where('status_hadir', 'tidak_hadir')->count(),
        ];
        return Inertia::render('events/Show', ['acara' => $acara, 'stats' => $stats]);
    }

    public function edit($id)
    {
        $acara = Acara::findOrFail($id);
        return Inertia::render('events/Edit', ['acara' => $acara]);
    }

    public function update(Request $request, $id)
    {
        $acara = Acara::findOrFail($id);
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'tempat' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'qr_per_keluarga' => 'nullable|integer|min:1|max:10',
            'status' => 'nullable|in:draft,active,completed,archived'
        ]);
        $acara->update($data);
        return redirect()->route('events.show', $acara->id)->with('success', 'Event berhasil diupdate');
    }

    public function destroy($id)
    {
        $acara = Acara::findOrFail($id);
        $acara->delete();
        return redirect()->route('events.index')->with('success', 'Event berhasil dihapus');
    }
}

