<?php

namespace App\Filament\Portal\Widgets;

use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ClientStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $mine = Project::where('client_id', auth()->user()->client_id);
        $next = (clone $mine)->whereNotIn('status', ['done', 'cancelled'])->whereNotNull('deadline')->orderBy('deadline')->first();

        return [
            Stat::make('Proyek berjalan', (clone $mine)->whereNotIn('status', ['done', 'cancelled'])->count())
                ->icon('heroicon-o-briefcase')->color('primary'),
            Stat::make('Proyek selesai', (clone $mine)->where('status', 'done')->count())
                ->icon('heroicon-o-check-badge')->color('success'),
            Stat::make('Tenggat terdekat', $next?->deadline->translatedFormat('d M Y') ?? '-')
                ->description($next?->title)->icon('heroicon-o-calendar-days')->color('warning'),
        ];
    }
}
