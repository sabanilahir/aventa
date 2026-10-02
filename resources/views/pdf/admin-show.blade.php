<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Directory Book - PATRAP SENOPATI</title>
    <style>

        /* =========================================================
            GLOBAL & PAGE SETUP (1 HALAMAN)
        ========================================================= */

        @page {
            margin: 0;
            size: A4 portrait;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: Helvetica, Arial, sans-serif;
            color: #000;
            font-size: 11px;
            background: #ffffff;
            width: 100%;
            height: 100%;
        }

        .container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            margin: 0 auto;
            background: #ffffff;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
        }


        /* =========================================================
            HEADER
        ========================================================= */

        .header {
            position: relative;
            padding: 20px 30px 10px 45px;
            text-align: center;
            /* height: 70px; */
        }

        .logo-left {
            position: absolute;
            left: 45px;
            top: 15px;
            width: 85px;
            height: 85px;
        }

        .header-title {
            margin-left: 70px;
        }

        .header h1 {
            font-size: 18px;
            font-weight: bold;
            color: #b08942;
            margin: 0;
            text-transform: uppercase;
            font-family: Georgia, serif;
            letter-spacing: 0.5px;
        }

        .header h2 {
            font-size: 15px;
            font-weight: bold;
            color: #b08942;
            margin: 2px 0;
            text-transform: uppercase;
            font-family: Georgia, serif;
        }

        .header h3 {
            font-size: 16px;
            font-weight: bold;
            color: #cc0000;
            margin: 3px 0;
            text-transform: uppercase;
            font-family: Georgia, serif;
        }

        .header p {
            font-size: 12px;
            font-weight: bold;
            color: #000;
            margin: 2px 0 0 0;
        }


        /* =========================================================
            TOP BANNER
        ========================================================= */

        .banner-slogan {
            background-color: #1b3e2b;
            border-top: 3px solid #b08942;
            border-bottom: 3px solid #b08942;
            padding: 6px 10px;
            text-align: center;
             margin-top: 12px;
        }

        .banner-slogan p {
            color: #e8ca74;
            font-size: 12px;
            font-weight: bold;
            margin: 0;

        }


        /* =========================================================
            CONTENT
        ========================================================= */

        .content-body {
            padding: 20px 35px 0 35px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table td {
            padding: 3px 0;
            vertical-align: top;
            font-size: 11px;
            line-height: 1.25;
        }

        .label-col {
            width: 185px;
            font-weight: bold;
            text-transform: uppercase;
            color: #111;
        }

        .separator-col {
            width: 15px;
            font-weight: bold;
            text-align: center;
        }

        .value-col {
            color: #222;
        }

        .highlight-value {
            color: #2563eb;
            font-weight: 500;
        }


        /* =========================================================
            FOOTER AREA (DISESUAIKAN)
        ========================================================= */

        .footer-section {
            width: 100%;
            margin-top: 65px;   /* Atur angka ini jika kurang/terlalu bawah */
            padding-left: 75px; /* Atur angka ini jika kurang/terlalu kanan */
            box-sizing: border-box;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-table td {
            vertical-align: bottom;
        }

        /* QR CODE */
        .qr-cell {
            width: 95px;
            padding-right: 8px;
        }

        .qr-box {
            width: 85px;
            height: 85px;
            border: 1px solid #4b5563;
            padding: 2px;
            background: #ffffff;
            text-align: center;
            box-sizing: border-box;
        }

        .qr-placeholder {
            padding-top: 30px;
            font-size: 10px;
            color: #555555;
        }

        /* FOTO MEMBER */
        .foto-cell {
            width: 118px;
            padding-right: 15px;
        }

        .foto-box {
            width: 108px;
            height: 145px;
            border: 2px solid #1f2937;
            background: #e5e7eb;
            text-align: center;
            box-sizing: border-box;
        }

        .foto-placeholder {
            padding-top: 60px;
            font-size: 10px;
            color: #555555;
        }

        /* AREA TANDA TANGAN & STEMPEL */
        .signature-area {
            vertical-align: bottom;
            text-align: left;
        }

        .tanggal {
            font-size: 11px;
            color: #000000;
            margin: 0 0 2px 0;
            text-align: left;
        }

        .sekretariat {
            font-size: 11px;
            color: #000000;
            margin: 0 0 10px 0;
            text-align: left;
        }

        .signature-wrapper {
            position: relative;
            height: 75px;
            margin-bottom: 5px;
        }

        .signature-overlap-container {
            position: absolute;
            left: -42px;
            top: -18px;
            width: 220px;
            height: 80px;
        }

        .stempel-layer {
            position: absolute;
            left: 0px;
            top: 0px;
            z-index: 1;
        }

        .ttd-layer {
            position: absolute;
            left: 35px;
            top: 10px;
            z-index: 2;
        }

        .sign-name-container {
            text-align: left;
        }

        .sign-name {
            display: inline-block;
            border-bottom: 1px solid #000000;
            font-weight: bold;
            font-size: 11px;
            padding-bottom: 2px;
            min-width: 230px;
            white-space: nowrap;
        }


        /* =========================================================
            BOTTOM BAR
        ========================================================= */

        .bottom-bar {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
        }

        .bottom-banner-slogan {
            background-color: #1b3e2b;
            border-top: 3px solid #b08942;
            padding: 6px 5px;
            text-align: center;
        }

        .bottom-banner-slogan p {
            color: #e8ca74;
            font-size: 12px;
            font-weight: bold;
            margin: 0;
        }

        .bottom-contact {
            background-color: #ffffff;
            padding: 6px;
            text-align: center;
        }

        .bottom-contact p {
            color: #000000;
            font-size: 11px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 0.3px;
        }

    </style>
</head>

<body>

<div class="container">

    {{-- HEADER --}}
    <div class="header">
        @if($logoUrl)
            <img src="{{ $logoUrl }}" alt="Logo" class="logo-left" style="width: 85px; height: 85px;">
        @endif

        <div class="header-title">
            <h1>DIRECTORY BOOK</h1>
            <h2>DESCENDANTS OF PANEMBAHAN SENOPATI</h2>
            <h3>PATRAP SENOPATI KOTAGEDE</h3>
            <p>(PAGUYUBAN TRAH PANEMBAHAN SENOPATI)</p>
        </div>
    </div>

    {{-- TOP SLOGAN --}}
    <div class="banner-slogan">
        <p>Mangasah Mingising Budi - Memasuh Malaning Bhumi - Memayu Hayuning Bawana</p>
    </div>

    {{-- CONTENT BODY --}}
    <div class="content-body">
        @php
            $formattedTanggalLahir = null;
            if ($member->tanggal_lahir) {
                try {
                    $formattedTanggalLahir = \Carbon\Carbon::parse($member->tanggal_lahir)->format('d F Y');
                } catch (\Exception $e) {
                    $formattedTanggalLahir = $member->tanggal_lahir;
                }
            }

            $tempatTanggalLahir = null;
            if ($member->tempat_lahir || $formattedTanggalLahir) {
                $tempatTanggalLahir = ($member->tempat_lahir ?? '') . ($member->tempat_lahir && $formattedTanggalLahir ? ', ' : '') . ($formattedTanggalLahir ?? '');
            }

            $allFields = [
                ['label' => 'NO. REGISTRASI', 'value' => $member->no_registrasi],
                ['label' => 'TRAH TUMERAH', 'value' => $member->trah_tumerah],
                ['label' => 'MENYA-MENYA', 'value' => $member->menya_menya],
                ['label' => 'MENYAMAN', 'value' => $member->menyaman],
                ['label' => 'AMPLENG', 'value' => $member->ampleng],
                ['label' => 'CUMPLENG', 'value' => $member->cumpleng],
                ['label' => 'GIYENG', 'value' => $member->giyeng],
                ['label' => 'CENDHENG', 'value' => $member->cendheng],
                ['label' => 'GROPAK WATON', 'value' => $member->gropak_waton],
                ['label' => 'GALIH ASEM', 'value' => $member->galih_asem],
                ['label' => 'DEBOK BOSOK', 'value' => $member->debok_bosok],
                ['label' => 'GROPAK SENTHE', 'value' => $member->gropak_senthe],
                ['label' => 'GANTUNG SIWUR', 'value' => $member->gantung_siwur],
                ['label' => 'UDHEG-UDHEG', 'value' => $member->udheg_udheg],
                ['label' => 'WARENG', 'value' => $member->wareng],
                ['label' => 'CANGGAH', 'value' => $member->canggah],
                ['label' => 'BUYUT', 'value' => $member->buyut],
                ['label' => 'SIMBAH / EYANG', 'value' => $member->simbah_eyang],
                ['label' => 'BAPAK / IBU', 'value' => $member->bapak_ibu],
                ['label' => 'NAMA ANDA', 'value' => $member->nama_anda, 'isHighlight' => true],
                ['label' => 'TEMPAT,TGL LAHIR', 'value' => $tempatTanggalLahir],
                ['label' => 'ALAMAT', 'value' => $member->alamat],
            ];
        @endphp

        {{-- DATA TABLE --}}
        <table class="data-table">
            @foreach($allFields as $field)
                <tr>
                    <td class="label-col">{{ $field['label'] }}</td>
                    <td class="separator-col">:</td>
                    <td class="value-col {{ isset($field['isHighlight']) && $field['isHighlight'] ? 'highlight-value' : '' }}">
                        {{ $field['value'] ?? '-' }}
                    </td>
                </tr>
            @endforeach
        </table>

        {{-- FOOTER SECTION --}}
        <div class="footer-section">
            <table class="footer-table">
                <tr>
                    {{-- 1. QR CODE --}}
                    <td class="qr-cell">
                        <div class="qr-box">
                            @if($qrUrl)
                                <img src="{{ $qrUrl }}" alt="QR Code" style="width: 79px; height: 79px; display: block;">
                            @else
                                <div class="qr-placeholder">QR</div>
                            @endif
                        </div>
                    </td>

                    {{-- 2. FOTO --}}
                    <td class="foto-cell">
                        <div class="foto-box">
                            @if($fotoUrl)
                                <img src="{{ $fotoUrl }}" alt="Foto" style="width: 104px; height: 141px; display: block;">
                            @else
                                <div class="foto-placeholder">FOTO</div>
                            @endif
                        </div>
                    </td>

                    {{-- 3. TANGGAL, STEMPEL, TTD, & NAMA --}}
                    <td class="signature-area">
                        <div class="tanggal">
                            {{ $alamat }}, {{ $tanggal }}
                        </div>
                        <div class="sekretariat">
                            Sekretariat Pendataan,
                        </div>

                        <div class="signature-wrapper">
                            <div class="signature-overlap-container">
                                {{-- Stempel di Layer Bawah --}}
                                <div class="stempel-layer">
                                    @if($stempelUrl)
                                        <img src="{{ $stempelUrl }}" alt="Stempel" style="width: 80px; height: 80px; display: block;">
                                    @endif
                                </div>
                                {{-- Tanda Tangan di Layer Atas (Menimpa Stempel) --}}
                                <div class="ttd-layer">
                                    @if($tandaTanganUrl)
                                        <img src="{{ $tandaTanganUrl }}" alt="Tanda Tangan" style="width: 120px; height: 60px; display: block;">
                                    @endif
                                </div>
                            </div>
                        </div>

                        <div class="sign-name-container">
                            <span class="sign-name">
                                {{ $namaPimpinan }}
                            </span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

    </div>

    {{-- BOTTOM BAR --}}
    <div class="bottom-bar">
        <div class="bottom-banner-slogan">
            <p>Mempererat Persaudaraan Membangun Peradaban</p>
        </div>
        <div class="bottom-contact">
            <p>{{ $email }} Phone : {{ $telepon }}</p>
        </div>
    </div>

</div>

</body>
</html>
