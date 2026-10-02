<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daftar Grup</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8">
<h1 class="text-2xl font-bold mb-6">Daftar Grup Tamu</h1>
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="bg-white rounded shadow p-6 mb-6">
<form action="{{ route('guest.grup.store') }}" method="POST" class="flex gap-4 items-end">
@csrf<div><label class="block text-sm mb-1">Nama Grup</label><input type="text" name="nama" required class="border rounded px-4 py-2" placeholder="VIP"></div>
<div><label class="block text-sm mb-1">Warna</label><input type="color" name="warna" value="#3B82F6" class="border rounded h-10"></div>
<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded h-10">+ Tambah</button>
</form>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
@forelse($grup as $g)
<div class="bg-white rounded shadow p-6">
<div class="flex items-center gap-2 mb-2">
<span class="w-4 h-4 rounded" style="background-color: {{ $g->warna }}"></span>
<h3 class="font-bold">{{ $g->nama }}</h3></div>
<p class="text-gray-500 text-sm">{{ $g->tamu_count }} tamu</p>
<div class="mt-4 flex gap-2">
<form action="{{ route('guest.grup.update', $g->id) }}" method="POST" class="flex gap-2">@csrf @method('PUT')
<input type="text" name="nama" value="{{ $g->nama }}" class="border rounded px-2 py-1 text-sm w-24">
<input type="color" name="warna" value="{{ $g->warna }}" class="border rounded h-8 w-8">
<button type="submit" class="bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-xs">Update</button></form>
</div>
</div>
@empty
<div class="col-span-4 bg-white rounded shadow p-8 text-center text-gray-500">Belum ada grup</div>
@endforelse
</div>
<div class="mt-6 text-center"><a href="{{ route('guest.dashboard') }}" class="text-gray-600">← Kembali</a></div>
</div></body></html>