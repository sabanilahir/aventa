<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daftar Souvenir</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 min-h-screen"><div class="container mx-auto px-4 py-8">
<h1 class="text-2xl font-bold mb-6">Daftar Souvenir Tamu</h1>
@if(session('success'))<div class="bg-green-100 text-green-700 p-3 rounded mb-4">{{ session('success') }}</div>@endif
<div class="flex gap-4 mb-4">
<a href="{{ route('guest.souvenir.index') }}" class="px-4 py-2 rounded {{ !request('status') ? 'bg-blue-600 text-white' : 'bg-white' }}">Semua</a>
<a href="{{ route('guest.souvenir.index', ['status' => 'diberikan']) }}" class="px-4 py-2 rounded {{ request('status') == 'diberikan' ? 'bg-green-600 text-white' : 'bg-white' }}">Diberikan</a>
<a href="{{ route('guest.souvenir.index', ['status' => 'belum']) }}" class="px-4 py-2 rounded {{ request('status') == 'belum' ? 'bg-yellow-600 text-white' : 'bg-white' }}">Belum</a>
</div>
<div class="bg-white rounded shadow overflow-hidden">
<table class="min-w-full"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left">Tamu</th><th class="px-4 py-3 text-left">Souvenir</th><th class="px-4 py-3 text-left">Jumlah</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left">Aksi</th></tr></thead>
<tbody class="divide-y">
@forelse($souvenir as $s)
<tr>
<td class="px-4 py-3">{{ $s->tamu->nama ?? '-' }}</td>
<td class="px-4 py-3">{{ $s->nama_souvenir }}</td>
<td class="px-4 py-3">x{{ $s->jumlah }}</td>
<td class="px-4 py-3">@if($s->diberikan)<span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Diberikan</span>@else<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Belum</span>@endif</td>
<td class="px-4 py-3"><form action="{{ route('guest.souvenir.update', $s->id) }}" method="POST" class="inline">@csrf<button type="submit" class="text-blue-600 text-sm">{{ $s->diberikan ? 'Batal' : 'Berikan' }}</button></form></td>
</tr>
@empty
<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Belum ada data</td></tr>
@endforelse
</tbody></table>
</div>
<div class="mt-4">{{ $souvenir->links() }}</div>
<div class="mt-6 text-center"><a href="{{ route('guest.dashboard') }}" class="text-gray-600">← Kembali</a></div>
</div></body></html>