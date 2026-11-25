<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;

// Daily database backup into storage/app/backups, keeping the newest N files. Works for SQLite and MySQL/MariaDB.
class BackupDatabase extends Command
{
    protected $signature = 'moteqar:backup {--keep=14 : jumlah cadangan terbaru yang disimpan}';

    protected $description = 'Cadangkan database ke storage/app/backups';

    public function handle(): int
    {
        $dir = storage_path('app/backups');
        is_dir($dir) || mkdir($dir, 0775, true);
        $stamp = now()->format('Ymd-His');
        $conn = config('database.default');
        $cfg = config("database.connections.$conn");

        if ($conn === 'sqlite') {
            $src = $cfg['database'];
            if (! is_file($src)) { $this->error("File database tidak ditemukan: $src"); return self::FAILURE; }
            $file = "$dir/db-$stamp.sqlite";
            DB::statement('VACUUM INTO '.DB::getPdo()->quote($file)); // consistent copy even while the site is in use
        } elseif (in_array($conn, ['mysql', 'mariadb'], true)) {
            $file = "$dir/db-$stamp.sql";
            $p = new Process(['mysqldump', '--single-transaction', '--no-tablespaces', '-h', $cfg['host'], '-P', (string) $cfg['port'], '-u', $cfg['username'], '-r', $file, $cfg['database']], null, ['MYSQL_PWD' => $cfg['password']]);
            $p->setTimeout(300)->run();
            if (! $p->isSuccessful()) { @unlink($file); $this->error('mysqldump gagal: '.trim($p->getErrorOutput()).' (pastikan mysqldump terpasang)'); return self::FAILURE; }
        } else {
            $this->error("Driver database '$conn' belum didukung."); return self::FAILURE;
        }

        $gz = "$file.gz";
        file_put_contents($gz, gzencode(file_get_contents($file), 9));
        unlink($file);
        $this->info('Cadangan dibuat: '.basename($gz));

        $old = collect(glob("$dir/db-*.gz"))->sort()->values();
        $old->slice(0, max(0, $old->count() - (int) $this->option('keep')))->each(fn ($f) => unlink($f));

        return self::SUCCESS;
    }
}
