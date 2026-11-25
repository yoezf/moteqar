<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Needs one cron entry on the server: * * * * * php /path/to/artisan schedule:run
Schedule::command('moteqar:backup')->dailyAt('02:00');
Schedule::command('moteqar:remind-payments')->dailyAt('08:00');
