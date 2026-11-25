<?php

namespace App\Filament\Resources\BuildItems\Schemas;

use App\Models\BuildItem;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BuildItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->schema([
                Select::make('icon')->label('Ikon')->options(BuildItem::ICONS)->default('globe-alt')->required()->searchable(),
                TextInput::make('sort')->label('Urutan')->numeric()->default(0),
                TextInput::make('title_id')->label('Judul (Indonesia)')->required(),
                TextInput::make('title_en')->label('Title (English)')->required(),
                Textarea::make('desc_id')->label('Deskripsi (Indonesia)')->rows(3),
                Textarea::make('desc_en')->label('Description (English)')->rows(3),
                Toggle::make('published')->label('Tampil di situs')->default(true),
            ]),
        ]);
    }
}
