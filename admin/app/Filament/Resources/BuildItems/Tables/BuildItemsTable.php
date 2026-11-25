<?php

namespace App\Filament\Resources\BuildItems\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class BuildItemsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('sort')
            ->defaultSort('sort')
            ->columns([
                TextColumn::make('title_id')->label('Judul')->searchable()->weight('bold')->description(fn ($record) => $record->desc_id)->wrap(),
                TextColumn::make('icon')->label('Ikon')->badge()->color('gray'),
                ToggleColumn::make('published')->label('Tampil'),
            ])
            ->recordActions([EditAction::make()->label('Ubah')])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
