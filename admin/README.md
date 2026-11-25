# MOTEQAR Admin

Dasbor untuk mengelola **klien dan proyek** serta **isi landing page** (`../website`). Dibuat dengan Laravel 13 dan Filament 4, database SQLite (satu berkas: `database/database.sqlite`).

## Menjalankan di komputer sendiri

```
serve.bat          (menjalankan http://localhost:8088/admin)
artisan.bat ...    (perintah artisan dengan ekstensi SQLite aktif)
```

Login pertama ada di `ADMIN-LOGIN.txt`. Ganti kata sandinya setelah masuk, lalu hapus berkas itu.

`serve.bat` dan `artisan.bat` mengaktifkan ekstensi SQLite hanya untuk proyek ini lewat folder `php-ext`, jadi `php.ini` sistem tidak diubah.

## Isi dasbor

**Klien**
- **Prospek**: kiriman form landing page. Status: Baru, Sudah dihubungi, Penawaran dikirim, Deal, Batal. Tombol *Jadikan proyek* membuat klien dan proyek dari prospek.
- **Klien**: data kontak dan catatan.
- **Proyek**: yang diinginkan klien (kebutuhan, berkas), tahap (Konsultasi, Penawaran, Pengerjaan, Revisi, Selesai), tenggat, harga, serta catatan perkembangan.

**Isi landing page**: Portofolio, Yang bisa kami buat, FAQ, Paket harga (Indonesia dan English).

## API untuk landing page

| Alamat | Fungsi |
|---|---|
| `POST /api/leads` | Menerima form kontak (nama, email, perusahaan, layanan, anggaran, paket, deskripsi). Dibatasi 8 kiriman per menit, ada kolom jebakan bot `website`. |
| `GET /api/site` | Isi landing page dalam dua bahasa (disimpan sementara 60 detik; otomatis dihapus saat isi diubah di dasbor). |

Domain landing page yang boleh memanggil API ditulis di `.env`: `LANDING_ORIGINS="https://moteqar.id,https://www.moteqar.id"`.

## Landing page membaca dasbor

`../website/app.js` sudah tersambung:
- Di `localhost` situs otomatis memakai `http://localhost:8088` (jalankan `serve.bat` dulu).
- Untuk situs yang online, isi `PROD_API` di bagian atas `app.js` dengan alamat dasbor, misalnya `"https://admin.moteqar.id"`, dan masukkan domain situs ke `LANDING_ORIGINS` di `.env`.
- Form kontak mengirim ke `/api/leads`. Layanan, FAQ, paket harga, dan portofolio dibaca dari `/api/site`.
- Kalau dasbor mati atau tidak terjangkau, situs tetap tampil memakai isi bawaan di `app.js`, dan form menampilkan pesan gagal kirim.
- Yang disimpan di dasbor: judul, industri, gambaran umum, fitur utama, teknologi, tautan, dan gambar kartu. Tantangan, solusi, tangkapan layar, dan PDF studi kasus tetap dari `app.js`, dipasangkan lewat judul Indonesia yang sama. Item baru dari dasbor menampilkan gambaran umum, teknologi, dan fitur utama saja.
- Teks seperti judul bagian dan catatan di bawah daftar portofolio masih dari `app.js`.

## Sebelum dipakai di internet

- Pasang di hosting PHP 8.2+ dengan HTTPS, isi `.env` (`APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, kunci aplikasi baru, `LANDING_ORIGINS`).
- Jalankan `php artisan migrate --force`, `php artisan storage:link`, `php artisan config:cache`.
- Pindahkan database ke MySQL/PostgreSQL bila pengguna bertambah, dan jadwalkan cadangan harian.
- Data klien bersifat pribadi: buat akun hanya untuk orang yang perlu.

## Portal klien

- Admin dan klien memakai satu halaman login `/login` (tombol "Masuk" di landing page); admin otomatis ke `/admin`, klien ke `/portal`.
- Buat akun: menu Klien > Klien > tombol "Akun portal" (email + password, bisa diganti kapan saja).
- Akun klien tidak bisa membuka `/admin` (403). `/admin/login` dan `/portal/login` hanya mengalihkan ke `/login`.

## Notifikasi email

- Prospek baru dari landing page → email ke semua akun admin, dan email balasan otomatis "permintaan Anda sudah kami terima" ke pengunjung yang mengisi form.
- Catatan yang ditandai "Tampilkan ke klien" → email ke akun portal klien itu.
- Tahap proyek berubah (Konsultasi, Penawaran, Pengerjaan, Revisi, Selesai) → email ke klien.
- Tagihan baru dan pembayaran lunas → email ke klien.
- Pengingat tagihan: tiap hari 08.00 (`moteqar:remind-payments`, butuh cron `schedule:run`), untuk tagihan belum lunas yang jatuh tempo dalam 3 hari atau sudah lewat, paling sering sekali seminggu per tagihan.
- Klien mengunggah berkas → email ke admin.
- Semua email untuk klien juga muncul di lonceng portal.
- Lokal: `MAIL_MAILER=log`, isi email muncul di `storage/logs/laravel.log`. Untuk mengirim sungguhan, isi `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS` di `.env` (mis. Gmail App Password atau layanan seperti Brevo/Resend).
- Kegagalan kirim email tidak menggagalkan penyimpanan lead/catatan; error dicatat di log.

## Lupa password klien

- Halaman login portal punya tautan "Lupa kata sandi?"; email tautan reset dikirim lewat pengaturan email di atas (lokal: lihat `storage/logs/laravel.log`).
- `QUEUE_CONNECTION=sync` supaya email terkirim langsung. Kalau di hosting diganti `database`, jalankan worker (`php artisan queue:work`) atau email tertahan.

## Hosting

Satu domain (landing di `/`, login di `/login`). Lihat `../DEPLOY.md` dan `../build-deploy.ps1`.

## Keamanan dan cadangan

- **2FA admin:** akun admin wajib mengaktifkan autentikasi dua faktor (aplikasi authenticator seperti Google Authenticator). Saat login pertama setelah fitur ini aktif, admin diminta memindai kode QR dan menyimpan kode pemulihan. Klien boleh mengaktifkannya sendiri lewat profil. Admin yang kehilangan HP dan kode pemulihan: hapus kolom lewat `php artisan tinker` (`User::where('email', '...')->update(['app_authentication_secret' => null, 'app_authentication_recovery_codes' => null])`).
- **Login Google** melewati 2FA (Google punya verifikasi sendiri). Matikan dengan mengosongkan `GOOGLE_CLIENT_ID` bila ingin 2FA selalu dipakai.
- **Cadangan database:** `php artisan moteqar:backup` membuat `storage/app/backups/db-<tanggal>.<sqlite|sql>.gz` dan menyimpan 14 terbaru (`--keep=N`). Berjalan otomatis tiap hari 02.00 bila cron server aktif: `* * * * * php /path/artisan schedule:run`. MySQL butuh `mysqldump` terpasang. Salin file cadangan ke tempat lain secara berkala (unduh lewat FTP/cPanel atau Google Drive), karena cadangan di server yang sama ikut hilang bila server rusak.
- Berkas unggahan (`storage/app/public`) tidak termasuk dalam cadangan database; salin foldernya bila dipakai.

## Fitur portal klien

- **Berkas:** di tiap proyek (admin dan portal) ada tab Berkas. Klien mengunggah brief dan dokumen, tim mengunggah hasil kerja. Maksimal 10 MB, jenis: PDF, gambar, Word, Excel, ZIP, teks. Berkas disimpan privat di `storage/app/private/project-files/shared` dan hanya bisa diunduh admin atau klien pemilik proyek lewat `/files/{id}`. Klien hanya bisa menghapus berkas yang ia unggah sendiri.
- **Tagihan:** admin menambah tagihan per proyek (judul, jumlah, jatuh tempo, status, catatan seperti nomor rekening). Klien melihatnya (hanya baca) beserta total yang sudah dibayar dari nilai proyek.
- **Notifikasi dalam aplikasi:** ikon lonceng di pojok kanan atas. Klien menerimanya saat ada kabar baru yang ditandai "Tampilkan ke klien". Admin menerimanya saat ada prospek baru atau klien mengunggah berkas (email juga dikirim).
- Pembayaran belum online: tagihan hanya informasi. Status "Lunas" diubah admin secara manual.
