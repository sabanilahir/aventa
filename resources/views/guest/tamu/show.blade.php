<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Detail Tamu</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto">
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="bg-white rounded shadow p-6 mb-6"><div class="flex justify-between items-start mb-4"><div><h1 class="text-2xl font-bold">{{ $tamu->nama }}</h1><p class="text-gray-600">{{ $tamu->acara->nama ?? '-' }}</p></div>
@if($tamu->status_hadir === 'hadir')<span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">HADIR</span>@else<span class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">BELUM HADIR</span>@endif</div>
<div class="grid grid-cols-2 gap-4 mb-6">
<div><p class="text-sm text-gray-500">Email</p><p>{{ $tamu->email ?? '-' }}</p></div>
<div><p class="text-sm text-gray-500">Telepon</p><p>{{ $tamu->no_telepon ?? '-' }}</p></div>
<div><p class="text-sm text-gray-500">Grup</p><p>@if($tamu->grup)<span class="px-2 py-1 rounded text-xs" style="background:{{ $tamu->grup->warna }}20;color:{{ $tamu->grup->warna }}">{{ $tamu->grup->nama }}</span>@else - @endif</p></div>
<div><p class="text-sm text-gray-500">Label</p><p>{{ $tamu->label ?? '-' }}</p></div>
<div><p class="text-sm text-gray-500">Jumlah Undangan</p><p>{{ $tamu->jumlah_undangan }} orang</p></div>
@if($tamu->waktu_hadir)<div><p class="text-sm text-gray-500">Waktu Check-in</p><p>{{ $tamu->waktu_hadir->format('d M Y, H:i') }}</p></div>@endif
</div>
@if($tamu->catatan)<div class="mb-4"><p class="text-sm text-gray-500">Catatan</p><p class="bg-gray-50 p-3 rounded">{{ $tamu->catatan }}</p></div>@endif
<div class="flex gap-2 mb-6"><a href="{{ route('guest.tamu.edit', $tamu->id) }}" class="bg-green-600 text-white px-4 py-2 rounded">Edit</a>
@if($tamu->status_hadir === 'belum')<form action="{{ route('guest.tamu.checkin', $tamu) }}" method="POST">@csrf<button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded">Check-in</button></form>@endif</div>
</div>
<div class="bg-white rounded shadow p-6 mb-6"><h2 class="text-lg font-semibold mb-4">Hadiah</h2>
<form action="{{ route('guest.hadiah.store', $tamu) }}" method="POST" class="flex gap-2 mb-4">@csrf<input type="text" name="nama_hadiah" placeholder="Nama hadiah" class="border rounded px-3 py-1 text-sm flex-1" required><input type="number" name="jumlah" value="1" class="border rounded px-3 py-1 w-20"><button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">+</button></form>
@forelse($tamu->hadiah as $h)<div class="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"><div><span class="font-medium">{{ $h->nama_hadiah }}</span><span class="text-gray-500 text-sm ml-2">x{{ $h->jumlah }}</span></div><div class="flex gap-2"><span class="text-sm {{ $h->status ? 'text-green-600' : 'text-yellow-600' }}">{{ $h->status ? 'Diterima' : 'Belum' }}</span><form action="{{ route('guest.hadiah.update', $h) }}" method="POST">@csrf<button type="submit" class="text-blue-600 text-sm">{{ $h->status ? 'Batal' : 'Terima' }}</button></form></div></div>@empty<p class="text-gray-500 text-sm">Belum ada hadiah</p>@endforelse</div>
<div class="text-center"><a href="{{ route('guest.tamu.index') }}" class="text-gray-600">← Kembali</a></div></div></div></body></html>