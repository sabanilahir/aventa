<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Directory Book</title>
    <style>
        @page { margin: 0; padding: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #333; }
        .page { width: 210mm; min-height: 297mm; padding: 15mm; margin: 0 auto; background: white; }
        .header { text-align: center; border-bottom: 3px double #8B4513; padding-bottom: 10px; margin-bottom: 15px; }
        .header-content { display: flex; align-items: center; justify-content: center; gap: 15px; }
        .logo { width: 60px; height: 60px; }
        .header-text h1 { font-size: 18px; color: #8B4513; margin-bottom: 2px; }
        .header-text h2 { font-size: 14px; color: #333; font-weight: normal; margin-bottom: 3px; }
        .moto { font-style: italic; font-size: 10px; color: #666; }
        .title-section { text-align: center; margin: 15px 0; padding: 10px; background: #f5f5f5; border: 2px solid #8B4513; border-radius: 5px; }
        .title-section h3 { font-size: 16px; color: #8B4513; text-transform: uppercase; letter-spacing: 2px; }
        .silsilah-section { margin-top: 15px; }
        .silsilah-section h4 { font-size: 12px; color: #8B4513; background: #f5f5f5; padding: 5px 10px; border-left: 3px solid #8B4513; margin-bottom: 8px; }
        .silsilah-table { width: 100%; border-collapse: collapse; }
        .silsilah-table th, .silsilah-table td { border: 1px solid #ddd; padding: 4px 6px; font-size: 10px; }
        .silsilah-table th { background: #f5f5f5; font-weight: bold; }
        .signature-section { margin-top: 25px; }
        .signature-boxes { display: flex; justify-content: space-between; }
        .signature-box { width: 45%; text-align: center; }
        .signature-image img { max-height: 35px; max-width: 120px; }
        .signature-name { font-weight: bold; font-size: 11px; border-top: 1px solid #333; padding-top: 3px; }
        .stamp-image { opacity: 0.7; margin-top: 5px; }
        .stamp-image img { width: 80px; height: 80px; }
        .footer { margin-top: 20px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #666; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="header-content">
                @if($logoUrl)<img src="{{ $logoUrl }}" alt="Logo" class="logo">@endif
                <div class="header-text">
                    <h1>PATRAP SENOPATI</h1>
                    <h2>Silsilah Trah Panembahan Senopati</h2>
                    <p class="moto">{{ $moto }}</p>
                </div>
            </div>
        </div>
        <div class="title-section">
            <h3>Directory Book Anggota</h3>
            <p>Dicetak: {{ $tanggalCetak }}</p>
        </div>
        <div class="silsilah-section">
            <h4>Garis Silsilah</h4>
            <table class="silsilah-table">
                <thead>
                    <tr><th>No</th><th>Istilah</th><th>Nama</th></tr>
                </thead>
                <tbody>
                    @if($member->no_registrasi)<tr><td>-</td><td>No. Registrasi</td><td><strong>{{ $member->no_registrasi }}</strong></td></tr>@endif
                    @if($member->trah_tumerah)<tr><td>1</td><td>Trah Tumerah</td><td><strong>{{ $member->trah_tumerah }}</strong></td></tr>@endif
                    @if($member->menya_menya)<tr><td>2</td><td>Menya-Menya</td><td><strong>{{ $member->menya_menya }}</strong></td></tr>@endif
                    @if($member->menyaman)<tr><td>3</td><td>Menyaman</td><td><strong>{{ $member->menyaman }}</strong></td></tr>@endif
                    @if($member->ampleng)<tr><td>4</td><td>Ampleng</td><td><strong>{{ $member->ampleng }}</strong></td></tr>@endif
                    @if($member->cumpleng)<tr><td>5</td><td>Cumpleng</td><td><strong>{{ $member->cumpleng }}</strong></td></tr>@endif
                    @if($member->giyeng)<tr><td>6</td><td>Giyeng</td><td><strong>{{ $member->giyeng }}</strong></td></tr>@endif
                    @if($member->cendheng)<tr><td>7</td><td>Cendheng</td><td><strong>{{ $member->cendheng }}</strong></td></tr>@endif
                    @if($member->gropak_waton)<tr><td>8</td><td>Gropak Waton</td><td><strong>{{ $member->gropak_waton }}</strong></td></tr>@endif
                    @if($member->galih_asem)<tr><td>9</td><td>Galih Asem</td><td><strong>{{ $member->galih_asem }}</strong></td></tr>@endif
                    @if($member->debok_bosok)<tr><td>10</td><td>Debok Bosok</td><td><strong>{{ $member->debok_bosok }}</strong></td></tr>@endif
                    @if($member->gropak_senthe)<tr><td>11</td><td>Gropak Senthe</td><td><strong>{{ $member->gropak_senthe }}</strong></td></tr>@endif
                    @if($member->gantung_siwur)<tr><td>12</td><td>Gantung Siwur</td><td><strong>{{ $member->gantung_siwur }}</strong></td></tr>@endif
                    @if($member->udheg_udheg)<tr><td>13</td><td>Udheg-Udheg</td><td><strong>{{ $member->udheg_udheg }}</strong></td></tr>@endif
                    @if($member->wareng)<tr><td>14</td><td>Wareng</td><td><strong>{{ $member->wareng }}</strong></td></tr>@endif
                    @if($member->canggah)<tr><td>15</td><td>Canggah</td><td><strong>{{ $member->canggah }}</strong></td></tr>@endif
                    @if($member->buyut)<tr><td>16</td><td>Buyut</td><td><strong>{{ $member->buyut }}</strong></td></tr>@endif
                    @if($member->simbah_eyang)<tr><td>17</td><td>Simbah/Eyang</td><td><strong>{{ $member->simbah_eyang }}</strong></td></tr>@endif
                    @if($member->bapak_ibu)<tr><td>18</td><td>Bapak/Ibu</td><td><strong>{{ $member->bapak_ibu }}</strong></td></tr>@endif
                </tbody>
            </table>
        </div>
        <div class="signature-section">
            <div class="signature-boxes">
                <div class="signature-box">
                    <p style="font-size:10px;color:#666;margin-bottom:40px;">Yang Bersangkutan</p>
                    <div class="signature-image">
                        @if($tandaTanganUrl)<img src="{{ $tandaTanganUrl }}" alt="TTD">@endif
                    </div>
                    <p class="signature-name">{{ $member->nama_anda ?? "-" }}</p>
                </div>
                <div class="signature-box" style="position:relative;">
                    <p style="font-size:10px;color:#666;margin-bottom:40px;">{{ $alamat }}, {{ $tanggalCetak }}</p>
                    <p style="font-size:10px;color:#666;margin-top:-35px;">Pimpinan PATRAP SENOPATI</p>
                    <div class="signature-image">
                        @if($tandaTanganUrl)<img src="{{ $tandaTanganUrl }}" alt="TTD">@endif
                    </div>
                    <p class="signature-name">{{ $namaPimpinan ?? "Pimpinan" }}</p>
                    @if($stempelUrl)<div class="stamp-image"><img src="{{ $stempelUrl }}" alt="Stempel"></div>@endif
                </div>
            </div>
        </div>
        <div class="footer">
            <p>{{ $alamat }} | Telp: {{ $telepon }} | Email: {{ $email }}</p>
            <p>Dokumen ini dicetak dari Sistem Direktori Anggota PATRAP SENOPATI</p>
        </div>
    </div>
</body>
</html>
