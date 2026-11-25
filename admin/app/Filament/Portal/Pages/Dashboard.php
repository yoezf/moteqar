<?php

namespace App\Filament\Portal\Pages;

use App\Filament\Portal\Widgets\ActiveProjects;
use App\Filament\Portal\Widgets\ClientStats;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $title = 'Beranda';

    protected static ?string $navigationLabel = 'Beranda';

    public function getHeading(): string
    {
        return 'Halo, '.auth()->user()->name;
    }

    public function getSubheading(): ?string
    {
        return 'Pantau perkembangan proyek Anda di MOTEQAR.';
    }

    public function getWidgets(): array
    {
        return [ClientStats::class, ActiveProjects::class];
    }

    public function getColumns(): int|array
    {
        return 1;
    }
}
