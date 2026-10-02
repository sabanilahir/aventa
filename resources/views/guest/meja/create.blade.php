<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Buat Meja</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8"><div class="max-w-md mx-auto bg-white rounded shadow p-6">
<h1 class="text-2xl font-bold mb-6">Tambah Meja Baru</h1>
<form action="{{ route('guest.meja.store') }}" method="POST">@csrf
<div class="mb-4"><label class="block mb-2">Nama Meja *</label><input type="text" name="nama" required class="w-full border rounded px-4 py-2" placeholder="Meja 1"></div>
<div class="mb-4"><label class="block mb-2">Acara *</label>
<select name="acara_id" required class="w-full border rounded px-4 py-2">
@foreach(\App\Models\Acara::all() as $a)<option value="{{ $a->id }}">{{ $a->nama }}</option>@endforeach
</select></div>
<div class="mb-4"><label class="block mb-2">Kapasitas</label><input type="number" name="kapasitas" value="10" min="1" class="w-full border rounded px-4 py-2"></div>
<div class="mb-4"><label class="block mb-2">Lokasi</label><input type="text" name="lokasi" class="w-full border rounded px-4 py-2" placeholder="Area depan"></div>
<div class="flex gap-4"><button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">Simpan</button><a href="{{ route('guest.meja.index') }}" class="bg-gray-400 text-white px-6 py-2 rounded">Batal</a></div>
</form></div></div></body></html>