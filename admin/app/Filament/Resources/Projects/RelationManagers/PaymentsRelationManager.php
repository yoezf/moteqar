<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    protected static ?string $title = 'Tagihan & pembayaran';

    protected static ?string $modelLabel = 'tagihan';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('Judul tagihan')->placeholder('DP 50%')->required(),
            TextInput::make('amount')->label('Jumlah')->numeric()->prefix('Rp')->required(),
            DatePicker::make('due_date')->label('Jatuh tempo'),
            Select::make('status')->label('Status')->options(['unpaid' => 'Belum dibayar', 'paid' => 'Lunas'])->default('unpaid')->required()->live(),
            DatePicker::make('paid_at')->label('Tanggal lunas')->visible(fn ($get) => $get('status') === 'paid'),
            Textarea::make('note')->label('Catatan untuk klien (nomor rekening, dll.)')->rows(3)->columnSpanFull(),
        ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Tagihan')->weight('bold'),
                TextColumn::make('amount')->label('Jumlah')->money('IDR', locale: 'id'),
                TextColumn::make('due_date')->label('Jatuh tempo')->date('d M Y'),
                TextColumn::make('status')->label('Status')->badge()
                    ->formatStateUsing(fn ($state) => $state === 'paid' ? 'Lunas' : 'Belum dibayar')->color(fn ($state) => $state === 'paid' ? 'success' : 'warning'),
            ])
            ->headerActions([CreateAction::make()->label('Tambah tagihan')])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
