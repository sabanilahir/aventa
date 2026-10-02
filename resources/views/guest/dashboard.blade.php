<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Guest - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard Guest Management</h1>
        
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {{ session('success') }}
            </div>
        @endif

        @if($acara)
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold">{{ $acara->nama }}</h2>
                <p class="text-gray-600">{{ $acara->tanggal->format('d M Y') }} | {{ $acara->waktu_mulai }}</p>
                @if($acara->tempat)
                    <p class="text-gray-500">{{ $acara->tempat }}</p>
                @endif
            </div>
        @else
            <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>Belum ada acara aktif. Silakan buat acara terlebih dahulu.</p>
                <a href="{{ route('guest.acara.create') }}" class="underline">Buat Acara</a>
            </div>
        @endif

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-500 rounded-lg shadow-md p-6 text-white">
                <h3 class="text-sm uppercase">Total Tamu</h3>
                <p class="text-3xl font-bold">{{ $stats['total_tamu'] }}</p>
            </div>
            <div class="bg-green-500 rounded-lg shadow-md p-6 text-white">
                <h3 class="text-sm uppercase">Tamu Hadir</h3>
                <p class="text-3xl font-bold">{{ $stats['tamu_hadir'] }}</p>
            </div>
            <div class="bg-yellow-500 rounded-lg shadow-md p-6 text-white">
                <h3 class="text-sm uppercase">Belum Hadir</h3>
                <p class="text-3xl font-bold">{{ $stats['tamu_belum'] }}</p>
            </div>
            <div class="bg-purple-500 rounded-lg shadow-md p-6 text-white">
                <h3 class="text-sm uppercase">Total Meja</h3>
                <p class="text-3xl font-bold">{{ $stats['total_meja'] }}</p>
            </div>
        </div>

        @if(count($recentTamu) > 0)
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Tamu Terbaru</h3>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left">Nama</th>
                        <th class="px-4 py-2 text-left">Grup</th>
                        <th class="px-4 py-2 text-left">Status</th>
                        <th class="px-4 py-2 text-left">Waktu</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @foreach($recentTamu as $tamu)
                    <tr>
                        <td class="px-4 py-2">{{ $tamu->nama }}</td>
                        <td class="px-4 py-2">
                            @if($tamu->grup)
                                <span class="px-2 py-1 rounded text-xs" style="background-color: {{ $tamu->grup->warna }}20; color: {{ $tamu->grup->warna }}">
                                    {{ $tamu->grup->nama }}
                                </span>
                            @endif
                        </td>
                        <td class="px-4 py-2">
                            @if($tamu->status_hadir === 'hadir')
                                <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Hadir</span>
                            @else
                                <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Tidak Hadir</span>
                            @endif
                        </td>
                        <td class="px-4 py-2 text-sm">{{ $tamu->waktu_hadir ? $tamu->waktu_hadir->format('H:i') : '-' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <div class="mt-6 text-center">
            <a href="{{ url('/dashboard') }}" class="text-gray-600 hover:text-gray-800">← Kembali ke Dashboard Utama</a>
        </div>
    </div>
</body>
</html>
