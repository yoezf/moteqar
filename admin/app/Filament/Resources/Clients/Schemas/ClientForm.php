<?php

namespace App\Filament\Resources\Clients\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Data klien')->columns(2)->schema([
                TextInput::make('name')->label('Nama')->required(),
                TextInput::make('company')->label('Perusahaan / usaha'),
                TextInput::make('email')->label('Email')->email(),
                TextInput::make('phone')->label('WhatsApp / telepon')->tel(),
                Textarea::make('notes')->label('Catatan')->rows(4)->columnSpanFull(),
            ]),
        ]);
    }
}
