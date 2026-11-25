<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\IconColumn;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NotesRelationManager extends RelationManager
{
    protected static string $relationship = 'notes';

    protected static ?string $title = 'Catatan & perkembangan';

    protected static ?string $modelLabel = 'catatan';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Textarea::make('body')->label('Catatan')->required()->rows(4)->columnSpanFull(),
            Toggle::make('is_public')->label('Tampilkan ke klien di portal')->helperText('Mati = catatan internal, klien tidak melihatnya.'),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('body')
            ->columns([
                TextColumn::make('body')->label('Catatan')->wrap()->limit(220),
                IconColumn::make('is_public')->label('Klien')->boolean(),
                TextColumn::make('author.name')->label('Oleh'),
                TextColumn::make('created_at')->label('Waktu')->dateTime('d M Y H:i'),
            ])
            ->headerActions([
                CreateAction::make()->label('Tambah catatan')->mutateDataUsing(fn (array $data) => $data + ['user_id' => auth()->id()]),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }
}
