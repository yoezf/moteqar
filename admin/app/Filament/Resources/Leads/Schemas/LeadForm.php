<?php

namespace App\Filament\Resources\Leads\Schemas;

use App\Models\Lead;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LeadForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Kontak')->columns(2)->schema([
                TextInput::make('name')->label('Nama')->required(),
                TextInput::make('email')->label('Email')->email()->required(),
                TextInput::make('company')->label('Perusahaan'),
                Select::make('client_id')->label('Klien terkait')->relationship('client', 'name')->searchable()->preload(),
            ]),
            Section::make('Kebutuhan')->columns(2)->schema([
                Select::make('service')->label('Layanan')->options(Lead::SERVICES),
                TextInput::make('budget')->label('Perkiraan anggaran'),
                TextInput::make('package')->label('Paket yang dipilih'),
                TextInput::make('source')->label('Sumber')->default('landing'),
                Textarea::make('details')->label('Deskripsi dari calon klien')->required()->rows(5)->columnSpanFull(),
            ]),
            Section::make('Tindak lanjut')->columns(2)->schema([
                Select::make('status')->label('Status')->options(Lead::STATUSES)->default('new')->required(),
                Textarea::make('notes')->label('Catatan internal')->rows(4)->columnSpanFull(),
            ]),
        ]);
    }
}
