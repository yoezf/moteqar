<?php

namespace App\Filament\Resources\Projects\Tables;

use App\Models\Lead;
use App\Models\Project;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')->label('Proyek')->description(fn (Project $r) => $r->client?->name)->searchable()->weight('bold'),
                TextColumn::make('service')->label('Layanan')->formatStateUsing(fn ($state) => Lead::SERVICES[$state] ?? $state)->toggleable(),
                TextColumn::make('status')->label('Tahap')->badge()
                    ->formatStateUsing(fn ($state) => Project::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => Project::STATUS_COLORS[$state] ?? 'gray'),
                TextColumn::make('deadline')->label('Tenggat')->date('d M Y')->sortable()
                    ->color(fn (Project $r) => $r->deadline && $r->deadline->isPast() && $r->isActive() ? 'danger' : null),
                TextColumn::make('agreed_price')->label('Harga')
                    ->formatStateUsing(fn ($state) => $state ? 'Rp '.number_format($state, 0, ',', '.') : '-')->sortable(),
                TextColumn::make('created_at')->label('Dibuat')->since()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')->label('Tahap')->options(Project::STATUSES),
                SelectFilter::make('client_id')->label('Klien')->relationship('client', 'name')->searchable()->preload(),
                Filter::make('active')->label('Hanya yang berjalan')->query(fn ($query) => $query->whereNotIn('status', ['done', 'cancelled']))->default(),
            ])
            ->recordActions([EditAction::make()->label('Buka')])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
