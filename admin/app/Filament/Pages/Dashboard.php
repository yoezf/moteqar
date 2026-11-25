<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $title = 'Dasbor';

    public function getHeading(): string
    {
        return 'Halo, '.auth()->user()->name;
    }

    public function getSubheading(): ?string
    {
        return 'Ringkasan bisnis MOTEQAR hari ini.';
    }

    public function getColumns(): int|array
    {
        return 1;
    }
}
