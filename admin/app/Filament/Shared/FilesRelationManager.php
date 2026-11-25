<?php

namespace App\Filament\Shared;

use App\Models\ProjectFile;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\FileUpload;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;

// Shared file area of a project. Used by the admin (deliverables, everything visible) and by the client portal
// (the client uploads briefs and may only delete their own uploads).
class FilesRelationManager extends RelationManager
{
    protected static string $relationship = 'files';

    protected static ?string $title = 'Berkas';

    protected static ?string $modelLabel = 'berkas';

    public function isReadOnly(): bool
    {
        return false;
    }

    private static function mine(ProjectFile $f): bool
    {
        return auth()->user()->role === 'admin' || $f->user_id === auth()->id();
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            FileUpload::make('path')->label('Berkas')->required()
                ->disk('local')->visibility('private')->directory('project-files/shared')
                ->storeFileNamesIn('name')->maxSize(10240)
                ->acceptedFileTypes(['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/zip', 'application/x-zip-compressed', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'])
                ->helperText('PDF, gambar, Word, Excel, ZIP, atau teks. Maksimal 10 MB.')
                ->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->label('Nama berkas')->weight('bold')->wrap(),
                TextColumn::make('from_client')->label('Dari')->badge()->formatStateUsing(fn ($state) => $state ? 'Klien' : 'Tim MOTEQAR')->color(fn ($state) => $state ? 'warning' : 'primary'),
                TextColumn::make('size')->label('Ukuran')->formatStateUsing(fn ($state) => number_format($state / 1048576, 2, ',', '.').' MB'),
                TextColumn::make('created_at')->label('Diunggah')->dateTime('d M Y H:i'),
            ])
            ->headerActions([
                CreateAction::make()->label('Unggah berkas')->icon('heroicon-o-arrow-up-tray')->modalHeading('Unggah berkas')
                    ->mutateDataUsing(fn (array $data) => $data + [
                        'user_id' => auth()->id(),
                        'from_client' => auth()->user()->role === 'client',
                        'size' => Storage::disk('local')->size($data['path']),
                    ]),
            ])
            ->recordActions([
                Action::make('download')->label('Unduh')->icon('heroicon-o-arrow-down-tray')->url(fn (ProjectFile $record) => url('/files/'.$record->id)),
                DeleteAction::make()->authorize(fn (ProjectFile $record) => self::mine($record))->visible(fn (ProjectFile $record) => self::mine($record)),
            ]);
    }
}
