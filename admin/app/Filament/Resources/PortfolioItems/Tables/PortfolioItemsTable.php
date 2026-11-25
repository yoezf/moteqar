<?php

namespace App\Filament\Resources\PortfolioItems\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class PortfolioItemsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('sort')
            ->defaultSort('sort')
            ->columns([
                ImageColumn::make('cover')->label('')->disk('public')->width(90)->height(56)
                    ->getStateUsing(fn ($record) => str_starts_with((string) $record->cover, 'portfolio/') && ! file_exists(storage_path('app/public/'.$record->cover)) ? null : $record->cover),
                TextColumn::make('title_id')->label('Judul')->searchable()->weight('bold')->description(fn ($record) => $record->industry_id),
                TextColumn::make('kind')->label('Jenis')->badge()->formatStateUsing(fn ($state) => $state === 'case' ? 'Studi kasus' : 'Live')->color(fn ($state) => $state === 'case' ? 'info' : 'success'),
                ToggleColumn::make('published')->label('Tampil'),
            ])
            ->recordActions([EditAction::make()->label('Ubah')])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
