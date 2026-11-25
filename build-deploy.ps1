# Membuat satu paket siap unggah untuk SATU domain: dist\moteqar.zip
#   https://domain.com/        -> landing page
#   https://domain.com/login   -> login admin dan klien
#   https://domain.com/admin   -> admin, /portal -> portal klien
# Contoh: powershell -ExecutionPolicy Bypass -File build-deploy.ps1 -Site https://moteqar.id
param(
    [Parameter(Mandatory = $true)][string]$Site,               # alamat domain, tanpa garis miring di akhir
    [string]$Composer = "$env:USERPROFILE\.config\herd\bin\composer.phar"
)
$ErrorActionPreference = "Stop"
$Site = $Site.TrimEnd("/")
$root = $PSScriptRoot; $dist = Join-Path $root "dist"
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory $dist | Out-Null
$tar = Join-Path $env:SystemRoot "System32\tar.exe"   # tar bawaan Windows (zip valid di Linux)

# 1) Admin: tanpa file lokal, vendor dipasang ulang tanpa paket dev
$adm = Join-Path $dist "moteqar"
$a = Join-Path $root "admin"
robocopy $a $adm /E /NFL /NDL /NJH /NJS /XD "$a\vendor" "$a\node_modules" "$a\tests" "$a\php-ext" "$a\.git" "$a\storage\logs" "$a\storage\framework\cache" "$a\storage\framework\sessions" "$a\storage\framework\views" "$a\bootstrap\cache" /XF ".env" "*.bat" "ADMIN-LOGIN.txt" "*.sqlite" "*.sqlite-journal" "phpunit.xml" ".env.production.example" "robots.txt" | Out-Null
foreach ($d in "storage\logs", "storage\framework\cache\data", "storage\framework\sessions", "storage\framework\views", "bootstrap\cache") { New-Item -ItemType Directory (Join-Path $adm $d) -Force | Out-Null }
Copy-Item (Join-Path $a ".env.production.example") (Join-Path $adm ".env.production.example")
Push-Location $adm
php $Composer install --no-dev --optimize-autoloader --no-scripts --no-interaction
Pop-Location

# 2) Landing page: disalin ke public\ (disajikan langsung di "/"), PROD_API = same-origin, domain diisi
$pub = Join-Path $adm "public"
Copy-Item (Join-Path $root "website\*") $pub -Recurse -Force
$utf8 = New-Object Text.UTF8Encoding $false
$js = Join-Path $pub "app.js"
$src = Get-Content $js -Raw -Encoding UTF8
if ($src -notmatch 'const PROD_API = "";') { throw "PROD_API tidak ditemukan di app.js" }
[IO.File]::WriteAllText($js, $src.Replace('const PROD_API = "";', 'const PROD_API = "same-origin";'), $utf8)
foreach ($f in "index.html", "robots.txt", "sitemap.xml") {
    $fp = Join-Path $pub $f
    [IO.File]::WriteAllText($fp, (Get-Content $fp -Raw -Encoding UTF8).Replace("https://moteqar.id", $Site), $utf8)
}
# robots: admin, portal, dan login tidak diindeks
Add-Content (Join-Path $pub "robots.txt") "`nUser-agent: *`nDisallow: /admin`nDisallow: /portal`nDisallow: /login"
# "/" harus menampilkan index.html (landing), bukan Laravel
$ht = Join-Path $pub ".htaccess"
$fast = @'
DirectoryIndex index.html index.php

# Kecepatan: kompres teks dan simpan aset statis di cache browser (CSS dan JS diberi ?v=N; gambar 1 bulan)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
</IfModule>

'@
[IO.File]::WriteAllText($ht, $fast + (Get-Content $ht -Raw -Encoding UTF8), $utf8)

& $tar -a -c -f (Join-Path $dist "moteqar.zip") -C $adm .
Get-ChildItem $dist -Filter *.zip | ForEach-Object { "{0}  {1:N1} MB" -f $_.Name, ($_.Length / 1MB) }
