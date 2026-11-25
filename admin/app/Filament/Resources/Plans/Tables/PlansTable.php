<?php

namespace App\Filament\Resources\Plans\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class PlansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('sort')
            ->defaultSort('sort')
            ->columns([
                TextColumn::make('name')->label('Paket')->weight('bold')->description(fn ($record) => $record->title_id),
                TextColumn::make('code')->label('Kode')->badge()->color('gray'),
                ToggleColumn::make('published')->label('Tampil'),
            ])
            ->recordActions([EditAction::make()->label('Ubah')]);
    }
}
