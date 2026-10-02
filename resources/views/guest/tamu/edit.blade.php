<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Tamu - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Tamu</h1>

            <form action="{{ route('guest.tamu.update', $tamu) }}" method="POST">
                @csrf @method('PUT')
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Nama Tamu *</label>
                    <input type="text" name="nama" value="{{ $tamu->nama }}" required class="w-full border rounded px-4 py-2">
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Email</label>
                        <input type="email" name="email" value="{{ $tamu->email }}" class="w-full border rounded px-4 py-2">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">No. Telepon</label>
                        <input type="text" name="no_telepon" value="{{ $tamu->no_telepon }}" class="w-full border rounded px-4 py-2">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Grup</label>
                        <select name="grup_id" class="w-full border rounded px-4 py-2">
                            <option value="">Pilih Grup</option>
                            @foreach($grups as $grup)
                                <option value="{{ $grup->id }}" {{ $tamu->grup_id == $grup->id ? 'selected' : '' }}>{{ $grup->nama }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Label</label>
                        <input type="text" name="label" value="{{ $tamu->label }}" class="w-full border rounded px-4 py-2">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Jumlah Undangan</label>
                    <input type="number" name="jumlah_undangan" value="{{ $tamu->jumlah_undangan }}" min="1" class="w-full border rounded px-4 py-2">
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Catatan</label>
                    <textarea name="catatan" class="w-full border rounded px-4 py-2" rows="3">{{ $tamu->catatan }}</textarea>
                </div>

                @if($pertanyaans->count() > 0)
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-3">Pertanyaan RSVP</h3>
                    @foreach($pertanyaans as $pq)
                        @php $jawaban = $tamu->jawaban->where('pertanyaan_id', $pq->id)->first(); @endphp
                        <div class="mb-3">
                            <label class="block text-gray-700 mb-1">{{ $pq->pertanyaan }}</label>
                            @if($pq->tipe === 'text')
                                <input type="text" name="jawaban[{{ $pq->id }}]" value="{{ $jawaban->jawaban ?? '' }}" class="w-full border rounded px-4 py-2">
                            @else
                                <input type="text" name="jawaban[{{ $pq->id }}]" value="{{ $jawaban->jawaban ?? '' }}" class="w-full border rounded px-4 py-2">
                            @endif
                        </div>
                    @endforeach
                </div>
                @endif

                <div class="flex gap-4">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Update</button>
                    <a href="{{ route('guest.tamu.show', $tamu->id) }}" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded">Batal</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
