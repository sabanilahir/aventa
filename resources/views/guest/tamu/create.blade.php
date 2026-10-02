<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Tamu - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Tambah Tamu Baru</h1>

            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {{ session('error') }}
                </div>
            @endif

            <form action="{{ route('guest.tamu.store') }}" method="POST">
                @csrf
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Acara *</label>
                    <select name="acara_id" required class="w-full border rounded px-4 py-2">
                        @foreach(\App\Models\Acara::all() as $a)
                            <option value="{{ $a->id }}">{{ $a->nama }} - {{ $a->tanggal->format('d M Y') }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Nama Tamu *</label>
                    <input type="text" name="nama" required class="w-full border rounded px-4 py-2" placeholder="Nama lengkap">
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Email</label>
                        <input type="email" name="email" class="w-full border rounded px-4 py-2" placeholder="email@example.com">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">No. Telepon</label>
                        <input type="text" name="no_telepon" class="w-full border rounded px-4 py-2" placeholder="08xxxxxxxxxx">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Grup</label>
                        <select name="grup_id" class="w-full border rounded px-4 py-2">
                            <option value="">Pilih Grup</option>
                            @foreach($grups as $grup)
                                <option value="{{ $grup->id }}">{{ $grup->nama }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Label</label>
                        <input type="text" name="label" class="w-full border rounded px-4 py-2" placeholder="VIP/Regular/dll">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Jumlah Undangan</label>
                        <input type="number" name="jumlah_undangan" value="1" min="1" class="w-full border rounded px-4 py-2">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Catatan</label>
                    <textarea name="catatan" class="w-full border rounded px-4 py-2" rows="3"></textarea>
                </div>

                @if($pertanyaans->count() > 0)
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-3">Pertanyaan RSVP</h3>
                    @foreach($pertanyaans as $pq)
                        <div class="mb-3">
                            <label class="block text-gray-700 mb-1">
                                {{ $pq->pertanyaan }}
                                @if($pq->is_required) <span class="text-red-500">*</span> @endif
                            </label>
                            @if($pq->tipe === 'text')
                                <input type="text" name="jawaban[{{ $pq->id }}]" class="w-full border rounded px-4 py-2" {{ $pq->is_required ? 'required' : '' }}>
                            @elseif($pq->tipe === 'radio')
                                @foreach(explode(',', $pq->options) as $opt)
                                    <label class="inline-flex items-center mr-4">
                                        <input type="radio" name="jawaban[{{ $pq->id }}]" value="{{ trim($opt) }}" {{ $pq->is_required ? 'required' : '' }}>
                                        <span class="ml-2">{{ trim($opt) }}</span>
                                    </label>
                                @endforeach
                            @else
                                <input type="text" name="jawaban[{{ $pq->id }}]" class="w-full border rounded px-4 py-2">
                            @endif
                        </div>
                    @endforeach
                </div>
                @endif

                <div class="flex gap-4">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Simpan</button>
                    <a href="{{ route('guest.tamu.index') }}" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded">Batal</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
