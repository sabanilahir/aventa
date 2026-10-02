<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Detail Acara</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto">
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="bg-white rounded shadow p-6 mb-6">
<div class="flex justify-between items-start mb-4"><div><h1 class="text-2xl font-bold">{{ $acara->nama }}</h1>
@if($acara->is_active)<span class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Aktif</span>@endif</div>
<div class="flex gap-2"><a href="{{ route('guest.acara.setActive', $acara->id) }}" class="bg-green-600 text-white px-3 py-1 rounded text-sm">Jadikan Aktif</a>
<a href="{{ route('guest.acara.edit', $acara->id) }}" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</a></div></div>
<div class="grid grid-cols-2 gap-4 mb-4">
<div><p class="text-sm text-gray-500">Tanggal</p><p>{{ $acara->tanggal->format('d M Y') }}</p></div>
<div><p class="text-sm text-gray-500">Waktu</p><p>{{ $acara->waktu_mulai }} @if($acara->waktu_selesai) - {{ $acara->waktu_selesai }} @endif</p></div>
<div><p class="text-sm text-gray-500">Tempat</p><p>{{ $acara->tempat ?? '-' }}</p></div>
<div><p class="text-sm text-gray-500">Total Tamu</p><p>{{ $acara->tamu->count() }}</p></div>
</div>
@if($acara->alamat)<div class="mb-4"><p class="text-sm text-gray-500">Alamat</p><p class="bg-gray-50 p-3 rounded">{{ $acara->alamat }}</p></div>@endif
@if($acara->deskripsi)<div class="mb-4"><p class="text-sm text-gray-500">Deskripsi</p><p>{{ $acara->deskripsi }}</p></div>@endif
</div>
<div class="bg-white rounded shadow p-6 mb-6"><h2 class="text-lg font-semibold mb-4">Daftar Tamu ({{ $acara->tamu->count() }})</h2>
<div class="flex justify-end mb-4"><a href="{{ route('guest.tamu.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded text-sm">+ Tambah Tamu</a></div>
<table class="min-w-full"><thead class="bg-gray-50"><tr><th class="px-4 py-2 text-left">Nama</th><th class="px-4 py-2 text-left">Status</th></tr></thead>
<tbody class="divide-y">@forelse($acara->tamu->take(10) as $t)
<tr><td class="px-4 py-2">{{ $t->nama }}</td><td class="px-4 py-2">@if($t->status_hadir === 'hadir')<span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Hadir</span>@else<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Belum</span>@endif</td></tr>
@empty<tr><td colspan="2" class="px-4 py-8 text-center text-gray-500">Belum ada tamu</td></tr>@endforelse</tbody></table>
@if($acara->tamu->count() > 10)<p class="text-center text-gray-500 mt-4">... dan {{ $acara->tamu->count() - 10 }} tamu lainnya</p>@endif</div>
<div class="text-center"><a href="{{ route('guest.acara.index') }}" class="text-gray-600">← Kembali</a></div></div></div></body></html>