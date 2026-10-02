<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daftar Acara</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8">
<h1 class="text-2xl font-bold mb-6">Daftar Acara</h1>
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="flex justify-between mb-4"><a href="{{ route('guest.acara.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded">+ Buat Acara</a></div>
<div class="space-y-4">
@forelse($acara as $a)
<div class="bg-white rounded shadow p-6 {{ $a->is_active ? 'border-l-4 border-green-500' : '' }}">
<div class="flex justify-between items-start">
<div><h2 class="text-xl font-bold">{{ $a->nama }}</h2>
<p class="text-gray-600">{{ $a->tanggal->format('d M Y') }} | {{ $a->waktu_mulai }}</p>
@if($a->tempat)<p class="text-gray-500">{{ $a->tempat }}</p>@endif
</div>
<div class="flex items-center gap-2">
@if($a->is_active)<span class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Aktif</span>@endif
<a href="{{ route('guest.acara.show', $a->id) }}" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">Detail</a>
<a href="{{ route('guest.acara.edit', $a->id) }}" class="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm">Edit</a>
</div>
</div>
</div>
@empty
<div class="bg-white rounded shadow p-8 text-center text-gray-500">Belum ada acara. <a href="{{ route('guest.acara.create') }}" class="text-blue-600 underline">Buat sekarang</a></div>
@endforelse
</div>
<div class="mt-4">{{ $acara->links() }}</div>
<div class="mt-6 text-center"><a href="{{ route('guest.dashboard') }}" class="text-gray-600">← Kembali</a></div>
</div></body></html>