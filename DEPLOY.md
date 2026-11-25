# Panduan hosting MOTEQAR

Satu domain untuk semuanya. Contoh memakai `moteqar.id`; ganti sesuai domain Anda.

| Alamat | Isi |
|---|---|
| `https://moteqar.id/` | landing page |
| `https://moteqar.id/login` | satu halaman login untuk admin dan klien |
| `https://moteqar.id/admin` | admin (otomatis setelah admin login) |
| `https://moteqar.id/portal` | portal klien (otomatis setelah klien login) |

## 1. Syarat hosting
- PHP 8.3 atau lebih baru (lokal memakai 8.4), ekstensi: `pdo_mysql` (atau `pdo_sqlite`), `mbstring`, `openssl`, `intl`, `fileinfo`, `zip`, `curl`, `xml`, `ctype`, `bcmath`.
- Database MySQL/MariaDB (disarankan) atau SQLite.
- HTTPS aktif, akses SSH atau terminal di cPanel (untuk `php artisan`).
- *Document root* domain harus menunjuk ke folder `public` milik aplikasi.

## 2. Buat paket (di komputer ini)
```powershell
powershell -ExecutionPolicy Bypass -File build-deploy.ps1 -Site https://moteqar.id
```
Hasilnya `dist/moteqar.zip`: aplikasi Laravel dengan landing page sudah ada di dalam `public/`, domain terisi di `index.html`, `robots.txt`, `sitemap.xml`, dan `app.js` memakai alamat yang sama dengan situsnya. Paket tidak berisi `.env`, database lokal, dan akun demo.

## 3. Pasang
1. Ekstrak `moteqar.zip` ke folder di server, lalu arahkan document root domain ke `<folder>/public`. Di shared hosting yang tidak bisa mengubah document root, ekstrak di luar `public_html` dan salin isi `public/` ke `public_html`, lalu sesuaikan path di `index.php`.
2. Buat database kosong. Salin `.env.production.example` menjadi `.env` dan isi semua nilai `GANTI` (database, `APP_URL`, SMTP).
3. Di terminal server, dari folder aplikasi:
```bash
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --class=SiteContentSeeder --force   # isi awal landing page (layanan, FAQ, portofolio, harga)
php artisan make:filament-user                          # akun admin pertama (peran otomatis "admin")
php artisan storage:link
php artisan package:discover
php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan filament:optimize
```
4. Izin tulis untuk `storage/` dan `bootstrap/cache/` (chmod 775).
5. Apache: `public/.htaccess` sudah memuat `DirectoryIndex index.html index.php` sehingga `/` menampilkan landing page. Nginx: pakai `index index.html index.php;` dan `try_files $uri $uri/ /index.php?$query_string;`.

## 4. Cek setelah online
- [ ] `https://moteqar.id/` menampilkan landing page, tombol **Masuk** menuju `/login`.
- [ ] Login admin di `/login` masuk ke `/admin`.
- [ ] Buat akun klien lewat Klien > Akun portal, login di `/login`, otomatis masuk ke `/portal`.
- [ ] Kirim form dari landing page: lead masuk ke admin dan email notifikasi sampai.
- [ ] Ubah FAQ di admin: muncul di landing page dalam sekitar 1 menit (cache).
- [ ] Coba "Lupa kata sandi" di `/login`.
- [ ] `APP_DEBUG=false` (halaman error tidak menampilkan detail).
- [ ] Nomor WhatsApp (`CONTACT` di `website/app.js`) sudah diisi 089657908809; ganti bila perlu lalu bangun ulang paket dan buat ulang PDF profil.

## 5. Pembaruan berikutnya
- Bangun ulang paket, ekstrak menimpa (jangan timpa `.env` dan `storage/`), lalu `php artisan migrate --force` dan ulangi perintah `cache` di atas.
- Cadangan: ekspor database secara berkala (mysqldump atau fitur backup hosting).

## Catatan
- `QUEUE_CONNECTION=sync`: email terkirim langsung. Kalau diganti `database`, jalankan `php artisan queue:work` atau cron.
- `robots.txt` melarang mesin pencari mengindeks `/admin`, `/portal`, dan `/login`.
- Karena satu domain, CORS tidak dipakai (`LANDING_ORIGINS` boleh kosong). Hanya saat pengembangan lokal (landing di port 8790, admin di 8088) CORS aktif.

## Login dengan Google (opsional)
Tombol "Masuk dengan Google" di `/login` hanya muncul kalau kredensial diisi. Hanya akun yang sudah ada (admin, atau klien yang dibuat lewat Akun portal) yang bisa masuk; email Google harus sama dengan email akunnya. Email tidak dikenal ditolak.
1. Buka [Google Cloud Console](https://console.cloud.google.com/apis/credentials), buat proyek, atur *OAuth consent screen* (nama MOTEQAR, email dukungan), lalu **Create credentials > OAuth client ID > Web application**.
2. *Authorized redirect URIs*: `https://moteqar.id/auth/google/callback` (dan `http://localhost:8088/auth/google/callback` untuk lokal). Ganti domain sesuai situs Anda.
3. Salin Client ID dan Client Secret ke `.env`: `GOOGLE_CLIENT_ID=...` dan `GOOGLE_CLIENT_SECRET=...`, lalu `php artisan config:cache`. `APP_URL` harus sama dengan domain situs.
4. Selama consent screen berstatus *Testing*, hanya email yang didaftarkan sebagai *Test users* yang bisa masuk; klik *Publish app* agar semua bisa.

## Analitik (opsional)
Di bagian atas `website/app.js` ada `ANALYTICS`. Tidak aktif di localhost.
- **Plausible** (disarankan, tanpa cookie sehingga tidak perlu banner persetujuan): daftarkan domain di plausible.io, ubah `plausible: true`.
- **Google Analytics 4**: isi `ga4: "G-XXXXXXXXXX"` (memakai cookie).
- Peristiwa yang dikirim: `Contact Open`, `WhatsApp Click`, `Login Click`, `PDF Download`, `Project View`, `Language`, `Lead Submit`. Di Plausible, daftarkan masing-masing sebagai *Goal* (Settings > Goals > Custom event). Di GA4 namanya huruf kecil dengan garis bawah (`contact_open`).
- Bangun ulang paket dan unggah setelah mengubahnya.

## Keamanan dan cadangan
- Tambahkan cron di hosting agar cadangan harian berjalan: `* * * * * php /path/ke/artisan schedule:run >> /dev/null 2>&1`. Cadangan tersimpan di `storage/app/backups` (14 terbaru). Unduh/salin keluar server secara berkala.
- Admin wajib 2FA (aplikasi authenticator) saat login pertama. Pastikan Anda sudah menyimpan kode pemulihan.
- Detail lengkap di `admin/README.md`.

## Kecepatan
- `build-deploy.ps1` menambahkan kompresi (mod_deflate) dan cache browser (mod_expires) ke `public/.htaccess`. Di Nginx aktifkan `gzip on;` dan header `expires` yang setara. Kalau hosting mendukung Brotli, aktifkan juga.
- Setelah online, ukur di [PageSpeed Insights](https://pagespeed.web.dev/) (halaman utama, versi seluler).
- Saat gambar portofolio diganti dengan nama file yang sama, tambahkan `?v=N` pada tautannya atau ganti nama file, karena gambar di-cache 1 bulan.
