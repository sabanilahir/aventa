<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Anggota - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Detail Anggota Trah</h1>
                <a href="{{ route('trah-members.index') }}" class="text-gray-600 hover:text-gray-800">← Kembali</a>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                @if($member->foto_pas)
                <div class="flex justify-center">
                    <img src="{{ Storage::url($member->foto_pas) }}" alt="Foto" class="w-48 h-48 object-cover rounded-lg border-2 border-gray-300">
                </div>
                @endif
                
                <div class="space-y-4">
                    <div><h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Identitas Diri</h3></div>
                    <div><span class="text-gray-500 text-sm">No. Registrasi:</span> <span class="font-medium">{{ $member->no_registrasi ?? '-' }}</span></div>
                    <div><span class="text-gray-500 text-sm">Nama:</span> <span class="font-medium">{{ $member->nama_anda }}</span></div>
                    <div><span class="text-gray-500 text-sm">TTL:</span> <span class="font-medium">{{ $member->tempat_lahir ?? '-' }}@if($member->tanggal_lahir), {{ \Carbon\Carbon::parse($member->tanggal_lahir)->format('d/m/Y') }}@endif</span></div>
                    <div><span class="text-gray-500 text-sm">Profesi:</span> <span class="font-medium">{{ $member->profesi_pekerjaan ?? '-' }}</span></div>
                    <div><span class="text-gray-500 text-sm">Telepon:</span> <span class="font-medium">{{ $member->no_telphone ?? '-' }}</span></div>
                    <div><span class="text-gray-500 text-sm">Email:</span> <span class="font-medium">{{ $member->email ?? '-' }}</span></div>
                    <div><span class="text-gray-500 text-sm">Alamat:</span> <span class="font-medium">{{ $member->alamat ?? '-' }}</span></div>
                </div>

                <div class="space-y-4">
                    <div><h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Garis Silsilah</h3></div>
                    @php $silsilah = ['trah_tumerah'=>'Trah Tumerah','menya_menya'=>'Menya-Menya','menyaman'=>'Menyaman','ampleng'=>'Ampleng','cumpleng'=>'Cumpleng','giyeng'=>'Giyeng','cendheng'=>'Cendheng','gropak_waton'=>'Gropak Waton','galih_asem'=>'Galih Asem','debok_bosok'=>'Debok Bosok','gropak_senthe'=>'Gropak Senthe','gantung_siwur'=>'Gantung Siwur','udheg_udheg'=>'Udheg-Udheg','wareng'=>'Wareng','canggah'=>'Canggah','buyut'=>'Buyut','simbah_eyang'=>'Simbah Eyang','bapak_ibu'=>'Bapak/Ibu']; @endphp
                    @foreach($silsilah as $field => $label)
                        @if($member->$field)
                        <div><span class="text-gray-500 text-sm">{{ $label }}:</span> <span class="font-medium">{{ $member->$field }}</span></div>
                        @endif
                    @endforeach
                </div>
            </div>

            @if($member->file_dokumen)
            <div class="mt-6 pt-6 border-t">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Dokumen</h3>
                <a href="{{ Storage::url($member->file_dokumen) }}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block">Download Dokumen</a>
            </div>
            @endif

            <div class="flex justify-end gap-3 pt-6 border-t mt-6">
                <a href="{{ route('trah-members.edit', $member->id) }}" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Edit</a>
                <form action="{{ route('trah-members.destroy', $member->id) }}" method="POST" onsubmit="return confirm('Yakin hapus?')">@csrf @method('DELETE')<button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Hapus</button></form>
            </div>
        </div>
    </div>
</body>
</html>