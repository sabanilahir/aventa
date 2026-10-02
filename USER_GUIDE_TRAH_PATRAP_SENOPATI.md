# USER GUIDE
# TRAH PATRAP SENOPATI

---

## DAFTAR ISI

1. [Login](#1-login)
2. [Dashboard](#2-dashboard)
3. [Manajemen Anggota Trah](#3-manajemen-anggota-trah)
4. [Import Data Excel](#4-import-data-excel)
5. [Export PDF](#5-export-pdf)
6. [Halaman Publik](#6-halaman-publik)
7. [Pengaturan Aplikasi](#7-pengaturan-aplikasi)
8. [Pengaturan Trah](#8-pengaturan-trah)
9. [Manajemen Menu](#9-manajemen-menu)
10. [Manajemen User](#10-manajemen-user)
11. [Troubleshoot](#11-troubleshoot)

---

## 1. LOGIN

### Langkah Login
1. Buka aplikasi di browser
2. Masukkan **Email** dan **Password**
3. Klik tombol **Login**

### Role & Akses

| Role | Akses |
|------|-------|
| Superadmin | Semua fitur + manajemen user |
| Admin | CRUD anggota, import, settings |
| User | Lihat anggota, export PDF |

---

## 2. DASHBOARD

Dashboard menampilkan statistik keanggotaan:
- Total anggota trah
- Jumlah anggota aktif
- Statistik berdasarkan field tertentu

---

## 3. MANAJEMEN ANGGOTA TRAH

### 3.1 Lihat Daftar Anggota

1. Klik menu **Trah Members**
2. Gunakan **kolom pencarian** untuk filter data
3. Klik tombol **Lihat** pada baris anggota untuk melihat detail

### 3.2 Tambah Anggota Baru

1. Klik tombol **+ Tambah Anggota**
2. Isi formulir dengan data lengkap:
   - **No. Registrasi** - Nomor unik anggota
   - **18 Field Trah** - Silsilah keturunan
   - **Nama Anda** - Nama anggota
   - **Tempat, Tanggal Lahir** - Format: KOTA, 17 APRIL 1907
   - **Alamat** - Alamat lengkap
   - **Pekerjaan** - Profesi/pekerjaan
   - **No. WhatsApp** - Nomor telepon
   - **E-mail** - Email aktif
3. Klik **Simpan**

### 3.3 Edit Anggota

1. Klik tombol **Edit** pada baris anggota
2. Update data yang diperlukan
3. Klik **Simpan**

### 3.4 Hapus Anggota

1. Klik tombol **Hapus** pada baris anggota
2. Klik **OK** pada konfirmasi

### 3.5 Field Trah (18 Generasi)

| No | Field | Keterangan |
|----|-------|------------|
| 1 | TRAH TUMERAH | Generasi 1 |
| 2 | MENYA-MENYA | Generasi 2 |
| 3 | MENYAMAN | Generasi 3 |
| 4 | AMPLENG | Generasi 4 |
| 5 | CUMPLENG | Generasi 5 |
| 6 | GIYENG | Generasi 6 |
| 7 | CENDHENG | Generasi 7 |
| 8 | GROPAK WATON | Generasi 8 |
| 9 | GALIH ASEM | Generasi 9 |
| 10 | DEBOK BOSOK | Generasi 10 |
| 11 | GROPAK SENTHE | Generasi 11 |
| 12 | GANTUNG SIWUR | Generasi 12 |
| 13 | UDHEG-UDHEG | Generasi 13 |
| 14 | WARENG | Generasi 14 |
| 15 | CANGGAH | Generasi 15 |
| 16 | BUYUT | Generasi 16 |
| 17 | SIMBAH/EYANG | Generasi 17 |
| 18 | BAPAK/IBU | Orang tua langsung |

---

## 4. IMPORT DATA EXCEL

### 4.1 Download Template

1. Klik tombol **Download Template**
2. File Excel .xlsx akan terdownload

### 4.2 Format Template Excel

| Kolom | Header | Contoh |
|-------|--------|--------|
| 1 | NO. REGISTRASI | TRH-001 |
| 2-19 | 18 Field Trah | Nama Lengkap |
| 20 | NAMA ANDA | Nama Lengkap |
| 21 | TEMPAT, TANGGAL LAHIR | SURABAYA, 17 APRIL 1907 |
| 22 | ALAMAT | Jl. examples No. 1 |
| 23 | PEKERJAAN | Wiraswasta |
| 24 | NO. WHATSAPP | 081234567890 |
| 25 | E-MAIL | email@example.com |

### 4.3 Import

1. Klik tombol **Import Excel**
2. Pilih file Excel yang sudah diedit
3. Klik **Import Sekarang**
4. Tunggu hingga proses selesai
5. Notifikasi sukses/gagal akan muncul

### 4.4 Catatan Penting

- Kolom **TEMPAT, TANGGAL LAHIR** harus dalam format: KOTA, TANGGAL BULAN TAHUN
- Contoh: PESUNINGAN, 17 APRIL 1907
- Tanggal lahir dalam kata: 17 APRIL 1907 bukan 17-04-1907

---

## 5. EXPORT PDF

### 5.1 Generate Kartu Anggota

1. Buka detail anggota
2. Klik tombol **Download PDF**
3. File PDF akan terdownload otomatis

### 5.2 Isi Kartu PDF

- Header dengan logo trah
- Moto organisasi
- 18 Field Trah (silsilah)
- Data anggota
- Foto (jika ada)
- QR Code (jika ada)
- Tanda tangan & stempel

---

## 6. HALAMAN PUBLIK

Halaman yang bisa diakses **tanpa login**:

### URL: / atau /anggota-trah

### Fitur:
- Lihat daftar anggota trah
- Pencarian anggota
- Detail profil anggota

### Langkah:
1. Buka URL / atau /anggota-trah
2. Gunakan kolom pencarian untuk filter
3. Klik **Lihat** untuk detail anggota

**Catatan:** Fitur edit, tambah, import, hapus hanya untuk user yang sudah login.

---

## 7. PENGATURAN APLIKASI

Menu: **Settings App** (Admin/Superadmin)

### 7.1 Informasi Umum

| Field | Keterangan |
|-------|------------|
| Nama Aplikasi | Nama sistem |
| Deskripsi | Deskripsi singkat |

### 7.2 Logo & Favicon

| Field | Keterangan |
|-------|------------|
| Logo | Gambar logo (.png/.jpg) |
| Favicon | Icon tab browser (.ico/.png) |

### 7.3 Langkah Upload Logo/Favicon

1. Menu **Settings App**
2. Klik **Pilih File** pada field Logo atau Favicon
3. Pilih file gambar dari komputer
4. Klik **Simpan**

### 7.4 SEO

| Field | Keterangan |
|-------|------------|
| Title | Title SEO |
| Description | Meta description |
| Keywords | Meta keywords |

### 7.5 Warna

- Pilih warna tema utama aplikasi

---

## 8. PENGATURAN TRAH

Menu: **Trah Settings** (Admin/Superadmin)

### 8.1 Gambar

| Field | Keterangan |
|-------|------------|
| Logo Organisasi | Logo resmi trah |
| Gambar Stempel | Stempel/cap resmi |
| Gambar Tanda Tangan | Tanda tangan penanggung jawab |
| Foto Panembahan | Foto Panembahan Senopati |
| Gambar QR Code | QR Code/link resmi |

### 8.2 Informasi

| Field | Keterangan |
|-------|------------|
| Nama Tanda Tangan | Nama pejabat yang menandatangani |
| Moto Organisasi | Moto/semboyan trah |
| Email Kontak | Email resmi |
| Telepon Kontak | No. telepon resmi |
| Alamat Kantor | Alamat kantor/sekretariat |

### 8.3 Upload Gambar

1. Menu **Trah Settings**
2. Klik **Pilih File** pada field gambar
3. Pilih file gambar dari komputer
4. Klik **Simpan**

### 8.4 Hapus Gambar

1. Menu **Trah Settings**
2. Klik tombol **Hapus** (ikon tempat sampah) pada gambar
3. Klik **OK** pada konfirmasi popup
4. Gambar akan dihapus dari sistem

---

## 9. MANAJEMEN MENU

Menu: **System** > **Menu Management** (Superadmin)

### 9.1 Tambah Menu

1. Klik **+ Tambah**
2. Isi form:
   - **Nama Menu** - Label menu
   - **URL** - Path/route
   - **Icon** - Nama icon (lucide-react)
   - **Parent** - Menu induk (jika submenu)
   - **Order** - Urutan tampil
   - **Aktif** - Ya/Tidak
3. Klik **Simpan**

### 9.2 Edit Menu

1. Klik menu yang akan diedit
2. Update data
3. Klik **Simpan**

### 9.3 Hapus Menu

1. Klik tombol **Hapus**
2. Klik **OK** pada konfirmasi

---

## 10. MANAJEMEN USER

Menu: **System** > **User Management** (Superadmin)

### 10.1 Tambah User

1. Klik **+ Tambah User**
2. Isi formulir:
   - **Nama** - Nama lengkap user
   - **Email** - Email user (unik)
   - **Password** - Password login
   - **Konfirmasi Password** - Ulangi password
   - **Role** - Pilih role (Superadmin/Admin/User)
3. Klik **Simpan**

### 10.2 Edit User

1. Klik user yang akan diedit
2. Update data
3. Klik **Simpan**

### 10.3 Hapus User

1. Klik tombol **Hapus**
2. Klik **OK** pada konfirmasi

### 10.4 Role

| Role | Deskripsi |
|------|-----------|
| Superadmin | Akses penuh sistem |
| Admin | CRUD data + settings |
| User | Read only |

---

## 11. TROUBLESHOOT

### Gambar tidak muncul

`ash
php artisan storage:link
`

### PDF error

`ash
composer require barryvdh/dompdf
`

### Permission denied

`ash
chmod -R 775 storage bootstrap/cache
`

### Clear cache

`ash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
`

### Import Excel gagal

- Pastikan format sesuai template
- Kolom TEMPAT, TANGGAL LAHIR tidak boleh kosong
- Format tanggal: KOTA, 17 APRIL 1907

---

## KONTAK

Untuk bantuan teknis, hubungi administrator sistem.

---

*Dokumen ini terakhir diupdate: September 2026*