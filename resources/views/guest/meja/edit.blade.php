<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Edit Meja</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8"><div class="max-w-md mx-auto bg-white rounded shadow p-6">
<h1 class="text-2xl font-bold mb-6">Edit Meja</h1>
<form action="{{ route('guest.meja.update', $meja->id) }}" method="POST">@csrf @method('PUT')
<div class="mb-4"><label class="block mb-2">Nama Meja *</label><input type="text" name="nama" value="{{ $meja->nama }}" required class="w-full border rounded px-4 py-2"></div>
<div class="mb-4"><label class="block mb-2">Kapasitas</label><input type="number" name="kapasitas" value="{{ $meja->kapasitas }}" min="1" class="w-full border rounded px-4 py-2"></div>
<div class="mb-4"><label class="block mb-2">Lokasi</label><input type="text" name="lokasi" value="{{ $meja->lokasi }}" class="w-full border rounded px-4 py-2"></div>
<div class="flex gap-4"><button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">Update</button><a href="{{ route('guest.meja.show', $meja->id) }}" class="bg-gray-400 text-white px-6 py-2 rounded">Batal</a></div>
</form></div></div></body></html>