<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daftar Meja</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8">
<h1 class="text-2xl font-bold mb-6">Daftar Meja</h1>
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="flex justify-between mb-4"><a href="{{ route('guest.meja.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded">+ Tambah Meja</a></div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
@forelse($meja as $m)
<div class="bg-white rounded shadow p-6">
<h3 class="text-lg font-bold">{{ $m->nama }}</h3>
<p class="text-gray-500 text-sm">Kapasitas: {{ $m->kapasitas }}</p>
<p class="text-gray-500 text-sm">{{ $m->mejaTamu->count() }} tamu duduk</p>
@if($m->lokasi)<p class="text-gray-500 text-sm">{{ $m->lokasi }}</p>@endif
<div class="mt-4 flex gap-2">
<a href="{{ route('guest.meja.show', $m->id) }}" class="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm">Detail</a>
<form action="{{ route('guest.meja.destroy', $m->id) }}" method="POST" onsubmit="return confirm('Hapus?')">@csrf @method('DELETE')<button type="submit" class="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm text-red-600">Hapus</button></form>
</div>
</div>
@empty
<div class="col-span-3 bg-white rounded shadow p-8 text-center text-gray-500">Belum ada meja. <a href="{{ route('guest.meja.create') }}" class="text-blue-600 underline">Buat sekarang</a></div>
@endforelse
</div>
<div class="mt-4">{{ $meja->links() }}</div>
<div class="mt-6 text-center"><a href="{{ route('guest.dashboard') }}" class="text-gray-600">← Kembali</a></div>
</div></body></html>