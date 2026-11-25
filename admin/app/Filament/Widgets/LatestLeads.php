<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestLeads extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Prospek terbaru';

    public function table(Table $table): Table
    {
        return $table
            ->query(Lead::query()->latest()->limit(8))
            ->paginated(false)
            ->columns([
                TextColumn::make('name')->label('Nama')->description(fn (Lead $r) => $r->company)->weight('bold'),
                TextColumn::make('service')->label('Layanan')->formatStateUsing(fn ($state) => Lead::SERVICES[$state] ?? $state),
                TextColumn::make('details')->label('Kebutuhan')->limit(70),
                TextColumn::make('status')->label('Status')->badge()
                    ->formatStateUsing(fn ($state) => Lead::STATUSES[$state] ?? $state)->color(fn ($state) => Lead::STATUS_COLORS[$state] ?? 'gray'),
                TextColumn::make('created_at')->label('Masuk')->since(),
            ])
            ->emptyStateHeading('Belum ada prospek')
            ->emptyStateDescription('Kiriman dari form landing page akan muncul di sini.');
    }
}
