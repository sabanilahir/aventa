<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Direktori Anggota Trah - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Direktori Anggota Trah Patrap Senopati</h1>
                <a href="{{ route('trah-members.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                    + Tambah Anggota
                </a>
            </div>

            @if(session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {{ session('error') }}
                </div>
            @endif

            <form method="GET" action="{{ route('trah-members.index') }}" class="mb-4">
                <div class="flex gap-2">
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama..." class="border rounded-md px-4 py-2 flex-1">
                    <button type="submit" class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md">Cari</button>
                    @if(request('search'))
                        <a href="{{ route('trah-members.index') }}" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md">Reset</a>
                    @endif
                </div>
            </form>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Registrasi</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tempat, Tgl Lahir</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesi</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse($members as $key => $member)
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 text-sm">{{ $members->firstItem() + $key }}</td>
                                <td class="px-4 py-3 text-sm">{{ $member->no_registrasi ?? '-' }}</td>
                                <td class="px-4 py-3 text-sm font-medium">{{ $member->nama_anda }}</td>
                                <td class="px-4 py-3 text-sm">
                                    {{ $member->tempat_lahir ?? '-' }}@if($member->tanggal_lahir), {{ \Carbon\Carbon::parse($member->tanggal_lahir)->format('d/m/Y') }}@endif
                                </td>
                                <td class="px-4 py-3 text-sm">{{ $member->profesi_pekerjaan ?? '-' }}</td>
                                <td class="px-4 py-3 text-sm">{{ $member->no_telphone ?? '-' }}</td>
                                <td class="px-4 py-3 text-sm">
                                    <div class="flex gap-2">
                                        <a href="{{ route('trah-members.show', $member->id) }}" class="text-blue-600 hover:text-blue-800">Lihat</a>
                                        <a href="{{ route('trah-members.edit', $member->id) }}" class="text-green-600 hover:text-green-800">Edit</a>
                                        <form action="{{ route('trah-members.destroy', $member->id) }}" method="POST" onsubmit="return confirm('Yakin hapus?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-800">Hapus</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="px-4 py-8 text-center text-gray-500">Tidak ada data</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $members->withQueryString()->links() }}
            </div>
        </div>
        
        <div class="mt-4 text-center">
            <a href="{{ url('/dashboard') }}" class="text-gray-600 hover:text-gray-800">← Kembali ke Dashboard</a>
        </div>
    </div>
</body>
</html>