<?php

namespace App\Filament\Resources\Plans\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class PlanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(3)->schema([
                TextInput::make('code')->label('Kode')->required()->unique(ignoreRecord: true)->helperText('starter, business, custom'),
                TextInput::make('name')->label('Nama paket')->required(),
                TextInput::make('sort')->label('Urutan')->numeric()->default(0),
                Toggle::make('published')->label('Tampil di situs')->default(true),
            ]),
            Tabs::make('Isi')->columnSpanFull()->tabs([
                Tab::make('Indonesia')->schema([
                    TextInput::make('title_id')->label('Deskripsi singkat')->required(),
                    Repeater::make('scope_id')->label('Cakupan')->simple(TextInput::make('item')->required())->addActionLabel('Tambah')->reorderable(),
                ]),
                Tab::make('English')->schema([
                    TextInput::make('title_en')->label('Short description')->required(),
                    Repeater::make('scope_en')->label('Scope')->simple(TextInput::make('item')->required())->addActionLabel('Add')->reorderable(),
                ]),
            ]),
        ]);
    }
}
