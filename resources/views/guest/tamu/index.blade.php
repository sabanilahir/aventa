<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Tamu</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Daftar Tamu</h1>
            <a href="{{ route('guest.tamu.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded">+ Tambah</a>
        </div>
        @if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
        @if(session('error'))<div class="bg-red-100 text-red-700 p-3 rounded mb-4">{{ session('error') }}</div>@endif
        
        <form method="GET" class="mb-4 bg-white p-4 rounded shadow">
            <div class="flex gap-4">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama..." class="border rounded px-4 py-2 flex-1">
                <select name="status" class="border rounded px-4 py-2">
                    <option value="">Semua</option>
                    <option value="belum" {{ request('status')=='belum'?'selected':'' }}>Belum Hadir</option>
                    <option value="hadir" {{ request('status')=='hadir'?'selected':'' }}>Hadir</option>
                </select>
                <button type="submit" class="bg-gray-700 text-white px-4 py-2 rounded">Filter</button>
            </div>
        </form>

        <div class="bg-white rounded shadow overflow-hidden">
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left">No</th>
                        <th class="px-4 py-3 text-left">Nama</th>
                        <th class="px-4 py-3 text-left">Telepon</th>
                        <th class="px-4 py-3 text-left">Grup</th>
                        <th class="px-4 py-3 text-left">Status</th>
                        <th class="px-4 py-3 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    @forelse($tamu as $key => $item)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3">{{ $tamu->firstItem() + $key }}</td>
                        <td class="px-4 py-3 font-medium">{{ $item->nama }}</td>
                        <td class="px-4 py-3">{{ $item->no_telepon ?? '-' }}</td>
                        <td class="px-4 py-3">
                            @if($item->grup)
                                <span class="px-2 py-1 rounded text-xs" style="background:{{ $item->grup->warna }}20;color:{{ $item->grup->warna }}">{{ $item->grup->nama }}</span>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            @if($item->status_hadir === 'hadir')
                                <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Hadir</span>
                            @else
                                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Belum</span>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            <a href="{{ route('guest.tamu.show', $item->id) }}" class="text-blue-600 mr-2">Lihat</a>
                            <a href="{{ route('guest.tamu.edit', $item->id) }}" class="text-green-600 mr-2">Edit</a>
                            @if($item->status_hadir === 'belum')
                                <form action="{{ route('guest.tamu.checkin', $item) }}" method="POST" class="inline">
                                    @csrf
                                    <button type="submit" class="text-purple-600 mr-2">Check-in</button>
                                </form>
                            @endif
                            <form action="{{ route('guest.tamu.destroy', $item) }}" method="POST" class="inline" onsubmit="return confirm('Hapus?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="text-red-600">Hapus</button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Belum ada data</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="mt-4">{{ $tamu->withQueryString()->links() }}</div>
        <div class="mt-6 text-center"><a href="{{ route('guest.dashboard') }}" class="text-gray-600">← Kembali</a></div>
    </div>
</body>
</html>