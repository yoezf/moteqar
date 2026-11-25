<?php

namespace App\Filament\Resources\PortfolioItems\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class PortfolioItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Umum')->columns(2)->schema([
                Select::make('kind')->label('Jenis')->options(['case' => 'Studi kasus (dengan PDF)', 'live' => 'Sudah live'])->default('live')->required(),
                TextInput::make('url')->label('Alamat situs (opsional)')->url()->helperText('Kosongkan jika tidak ingin menautkan ke web.'),
                FileUpload::make('cover')->label('Gambar kartu')->image()->disk('public')->directory('portfolio')->visibility('public')->imageEditor()->columnSpanFull(),
                TagsInput::make('tech')->label('Teknologi')->columnSpanFull(),
                TextInput::make('sort')->label('Urutan')->numeric()->default(0),
                Toggle::make('published')->label('Tampil di situs')->default(true),
            ]),
            Tabs::make('Isi')->columnSpanFull()->tabs([
                Tab::make('Indonesia')->schema([
                    TextInput::make('title_id')->label('Judul')->required(),
                    TextInput::make('industry_id')->label('Industri'),
                    Textarea::make('overview_id')->label('Gambaran umum')->rows(4),
                    Repeater::make('highlights_id')->label('Fitur utama (4 baris ideal)')->simple(TextInput::make('item')->required())->addActionLabel('Tambah fitur')->reorderable(),
                ]),
                Tab::make('English')->schema([
                    TextInput::make('title_en')->label('Title')->required(),
                    TextInput::make('industry_en')->label('Industry'),
                    Textarea::make('overview_en')->label('Overview')->rows(4),
                    Repeater::make('highlights_en')->label('Key features')->simple(TextInput::make('item')->required())->addActionLabel('Add feature')->reorderable(),
                ]),
            ]),
        ]);
    }
}
