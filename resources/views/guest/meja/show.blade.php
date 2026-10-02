<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Detail Meja</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto">
<div class="bg-white rounded shadow p-6 mb-6">
<div class="flex justify-between items-start mb-4"><div><h1 class="text-2xl font-bold">{{ $meja->nama }}</h1><p class="text-gray-600">{{ $meja->acara->nama ?? '-' }}</p></div>
<a href="{{ route('guest.meja.edit', $meja->id) }}" class="bg-blue-600 text-white px-4 py-2 rounded text-sm">Edit</a></div>
<div class="grid grid-cols-2 gap-4"><div><p class="text-sm text-gray-500">Kapasitas</p><p>{{ $meja->kapasitas }} orang</p></div>
<div><p class="text-sm text-gray-500">Tamu Duduk</p><p>{{ $meja->mejaTamu->count() }} orang</p></div>
@if($meja->lokasi)<div class="col-span-2"><p class="text-sm text-gray-500">Lokasi</p><p>{{ $meja->lokasi }}</p></div>@endif</div>
</div>
<div class="bg-white rounded shadow p-6">
<h2 class="text-lg font-semibold mb-4">Daftar Tamu di Meja Ini</h2>
<div class="space-y-2">
@forelse($meja->mejaTamu as $mt)
<div class="flex justify-between items-center p-3 bg-gray-50 rounded">
<div><span class="font-medium">{{ $mt->tamu->nama ?? '-' }}</span> @if($mt->nomor_kursi)<span class="text-gray-500 text-sm ml-2">Kursi #{{ $mt->nomor_kursi }}</span>@endif</div>
<form action="{{ route('guest.meja.removeTamu', $mt->id) }}" method="POST">@csrf @method('DELETE')<button type="submit" class="text-red-600 text-sm">Hapus</button></form>
</div>
@empty
<p class="text-gray-500 text-sm">Belum ada tamu di meja ini</p>
@endforelse
</div>
</div>
<div class="mt-6 text-center"><a href="{{ route('guest.meja.index') }}" class="text-gray-600">← Kembali</a></div>
</div></div></body></html>