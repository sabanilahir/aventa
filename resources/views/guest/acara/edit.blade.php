<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Edit Acara</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8"><div class="max-w-2xl mx-auto bg-white rounded shadow p-6">
<h1 class="text-2xl font-bold mb-6">Edit Acara</h1>
<form action="{{ route('guest.acara.update', $acara->id) }}" method="POST">@csrf @method('PUT')
<div class="mb-4"><label class="block mb-2">Nama Acara *</label><input type="text" name="nama" value="{{ $acara->nama }}" required class="w-full border rounded px-4 py-2"></div>
<div class="grid grid-cols-2 gap-4 mb-4"><div><label class="block mb-2">Tanggal *</label><input type="date" name="tanggal" value="{{ $acara->tanggal->format('Y-m-d') }}" required class="w-full border rounded px-4 py-2"></div>
<div><label class="block mb-2">Waktu Mulai *</label><input type="time" name="waktu_mulai" value="{{ $acara->waktu_mulai }}" required class="w-full border rounded px-4 py-2"></div></div>
<div class="grid grid-cols-2 gap-4 mb-4"><div><label class="block mb-2">Waktu Selesai</label><input type="time" name="waktu_selesai" value="{{ $acara->waktu_selesai }}" class="w-full border rounded px-4 py-2"></div>
<div><label class="block mb-2">Tempat</label><input type="text" name="tempat" value="{{ $acara->tempat }}" class="w-full border rounded px-4 py-2"></div></div>
<div class="mb-4"><label class="block mb-2">Alamat</label><textarea name="alamat" rows="2" class="w-full border rounded px-4 py-2">{{ $acara->alamat }}</textarea></div>
<div class="mb-4"><label class="block mb-2">Deskripsi</label><textarea name="deskripsi" rows="3" class="w-full border rounded px-4 py-2">{{ $acara->deskripsi }}</textarea></div>
<div class="mb-4"><label class="inline-flex items-center"><input type="checkbox" name="is_active" class="mr-2" {{ $acara->is_active ? 'checked' : '' }}><span>Jadikan acara aktif</span></label></div>
<div class="flex gap-4"><button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">Update</button><a href="{{ route('guest.acara.show', $acara->id) }}" class="bg-gray-400 text-white px-6 py-2 rounded">Batal</a></div>
</form></div></div></body></html>