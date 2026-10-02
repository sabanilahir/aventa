<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daftar Pertanyaan</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8">
<h1 class="text-2xl font-bold mb-6">Daftar Pertanyaan RSVP</h1>
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="bg-white rounded shadow p-6 mb-6">
<h2 class="font-semibold mb-4">Tambah Pertanyaan Baru</h2>
<form action="{{ route('guest.pertanyaan.store') }}" method="POST" class="flex flex-wrap gap-4 items-end">
@csrf
<div class="flex-1"><label class="block text-sm mb-1">Pertanyaan</label><input type="text" name="pertanyaan" required class="w-full border rounded px-4 py-2" placeholder="Apakah Anda akan hadir?"></div>
<div class="w-32"><label class="block text-sm mb-1">Tipe</label><select name="tipe" class="w-full border rounded px-4 py-2"><option value="text">Text</option><option value="radio">Radio</option><option value="select">Select</option></select></div>
<div class="w-48"><label class="block text-sm mb-1">Options (jika radio/select)</label><input type="text" name="options" class="w-full border rounded px-4 py-2" placeholder="Ya,Tidak,Mungkin"></div>
<div><label class="block text-sm mb-1">Wajib</label><input type="checkbox" name="is_required" value="1" class="h-10"></div>
<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded h-10">+ Tambah</button>
</form>
</div>
<div class="bg-white rounded shadow overflow-hidden">
<table class="min-w-full"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left">No</th><th class="px-4 py-3 text-left">Pertanyaan</th><th class="px-4 py-3 text-left">Tipe</th><th class="px-4 py-3 text-left">Wajib</th><th class="px-4 py-3 text-left">Aksi</th></tr></thead>
<tbody class="divide-y">
@forelse($pertanyaan as $key => $p)
<tr>
<td class="px-4 py-3">{{ $key + 1 }}</td>
<td class="px-4 py-3">{{ $p->pertanyaan }}</td>
<td class="px-4 py-3"><span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ ucfirst($p->tipe) }}</span></td>
<td class="px-4 py-3">@if($p->is_required)<span class="text-red-600">Ya</span>@else<span class="text-gray-400">Tidak</span>@endif</td>
<td class="px-4 py-3">
<form action="{{ route('guest.pertanyaan.destroy', $p->id) }}" method="POST" class="inline" onsubmit="return confirm('Hapus?')">@csrf @method('DELETE')<button type="submit" class="text-red-600 text-sm">Hapus</button></form>
</td>
</tr>
@empty
<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Belum ada pertanyaan</td></tr>
@endforelse
</tbody></table>
</div>
<div class="mt-6 text-center"><a href="{{ route('guest.dashboard') }}" class="text-gray-600">← Kembali</a></div>
</div></body></html>