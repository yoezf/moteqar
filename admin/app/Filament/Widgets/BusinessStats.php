<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class BusinessStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $active = Project::whereNotIn('status', ['done', 'cancelled']);
        $late = (clone $active)->whereDate('deadline', '<', today())->count();

        return [
            Stat::make('Prospek baru', Lead::where('status', 'new')->count())
                ->description('Belum dihubungi')->icon('heroicon-o-inbox-arrow-down')->color('info'),
            Stat::make('Proyek berjalan', (clone $active)->count())
                ->description($late ? "$late melewati tenggat" : 'Semua sesuai tenggat')->icon('heroicon-o-briefcase')->color($late ? 'danger' : 'primary'),
            Stat::make('Nilai proyek berjalan', 'Rp '.number_format((clone $active)->sum('agreed_price'), 0, ',', '.'))
                ->description('Harga disepakati')->icon('heroicon-o-banknotes')->color('success'),
            Stat::make('Proyek selesai', Project::where('status', 'done')->count())
                ->description('Sepanjang waktu')->icon('heroicon-o-check-badge')->color('gray'),
        ];
    }
}
