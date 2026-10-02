<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Anggota - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Tambah Anggota Trah Baru</h1>
                <a href="{{ route('trah-members.index') }}" class="text-gray-600 hover:text-gray-800">← Kembali</a>
            </div>

            @if($errors->any())
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <ul class="list-disc list-inside">@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul>
                </div>
            @endif

            <form action="{{ route('trah-members.store') }}" method="POST" enctype="multipart/form-data">@csrf
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h3 class="font-semibold text-lg border-b pb-2 text-gray-700">Garis Silsilah</h3>
                        @php $silsilah = ['trah_tumerah'=>'Trah Tumerah','menya_menya'=>'Menya-Menya','menyaman'=>'Menyaman','ampleng'=>'Ampleng','cumpleng'=>'Cumpleng','giyeng'=>'Giyeng','cendheng'=>'Cendheng','gropak_waton'=>'Gropak Waton','galih_asem'=>'Galih Asem','debok_bosok'=>'Debok Bosok','gropak_senthe'=>'Gropak Senthe','gantung_siwur'=>'Gantung Siwur','udheg_udheg'=>'Udheg-Udheg','wareng'=>'Wareng','canggah'=>'Canggah','buyut'=>'Buyut','simbah_eyang'=>'Simbah Eyang','bapak_ibu'=>'Bapak/Ibu']; @endphp
                        <div class="grid grid-cols-2 gap-4">
                            @foreach($silsilah as $name => $label)
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $label }}</label>
                                <input type="text" name="{{ $name }}" value="{{ old($name) }}" class="w-full border rounded-md px-3 py-2">
                            </div>
                            @endforeach
                        </div>
                    </div>
                    <div class="space-y-4">
                        <h3 class="font-semibold text-lg border-b pb-2 text-gray-700">Identitas Diri</h3>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Registrasi</label><input type="text" name="no_registrasi" value="{{ old('no_registrasi') }}" class="w-full border rounded-md px-3 py-2"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label><input type="text" name="nama_anda" value="{{ old('nama_anda') }}" required class="w-full border rounded-md px-3 py-2"></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label><input type="text" name="tempat_lahir" value="{{ old('tempat_lahir') }}" class="w-full border rounded-md px-3 py-2"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label><input type="date" name="tanggal_lahir" value="{{ old('tanggal_lahir') }}" class="w-full border rounded-md px-3 py-2"></div>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label><textarea name="alamat" rows="3" class="w-full border rounded-md px-3 py-2">{{ old('alamat') }}</textarea></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Profesi/Pekerjaan</label><input type="text" name="profesi_pekerjaan" value="{{ old('profesi_pekerjaan') }}" class="w-full border rounded-md px-3 py-2"></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label><input type="text" name="no_telphone" value="{{ old('no_telphone') }}" class="w-full border rounded-md px-3 py-2"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value="{{ old('email') }}" class="w-full border rounded-md px-3 py-2"></div>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Foto Pas</label><input type="file" name="foto_pas" accept="image/*" class="w-full border rounded-md px-3 py-2"><p class="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maks: 2MB</p></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">File Dokumen</label><input type="file" name="file_dokumen" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="w-full border rounded-md px-3 py-2"><p class="text-xs text-gray-500 mt-1">Format: PDF, JPG, PNG, DOC, DOCX. Maks: 5MB</p></div>
                    </div>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t mt-6">
                    <a href="{{ route('trah-members.index') }}" class="px-4 py-2 border rounded-md hover:bg-gray-50">Batal</a>
                    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>