<?php

namespace App\Filament\Portal\Resources\Projects;

use App\Filament\Portal\Resources\Projects\Pages\ListProjects;
use App\Filament\Portal\Resources\Projects\Pages\ViewProject;
use App\Models\Project;
use BackedEnum;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ViewEntry;
use Filament\Actions\ViewAction;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

// Read-only view of the signed-in client's own projects.
class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $modelLabel = 'Proyek';

    protected static ?string $pluralModelLabel = 'Proyek saya';

    protected static ?string $navigationLabel = 'Proyek saya';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBriefcase;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('client_id', auth()->user()->client_id);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')->label('Proyek')->weight('bold')->description(fn ($record) => $record->serviceLabel())->searchable(),
                TextColumn::make('status')->label('Tahap')->badge()
                    ->formatStateUsing(fn ($state) => Project::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => Project::STATUS_COLORS[$state] ?? 'gray'),
                TextColumn::make('progress')->label('Progres')->state(fn ($record) => $record->progress().'%'),
                TextColumn::make('deadline')->label('Tenggat')->date('d M Y'),
            ])
            ->recordActions([ViewAction::make()->label('Lihat')])
            ->recordUrl(fn ($record) => static::getUrl('view', ['record' => $record]));
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Progres proyek')->schema([
                ViewEntry::make('stepper')->hiddenLabel()->view('filament.portal.stepper-entry'),
            ]),
            Section::make('Ringkasan')->columns(3)->schema([
                TextEntry::make('service')->label('Layanan')->formatStateUsing(fn ($state) => \App\Models\Lead::SERVICES[$state] ?? $state)->placeholder('-'),
                TextEntry::make('deadline')->label('Tenggat')->date('d M Y')->placeholder('-'),
                TextEntry::make('agreed_price')->label('Nilai proyek')->money('IDR', locale: 'id')->placeholder('-'),
                TextEntry::make('requirements')->label('Kebutuhan')->columnSpanFull()->placeholder('-'),
            ]),
            Section::make('Kabar terbaru dari tim')->schema([
                RepeatableEntry::make('publicNotes')->hiddenLabel()->placeholder('Belum ada kabar.')->schema([
                    TextEntry::make('created_at')->hiddenLabel()->dateTime('d M Y, H:i')->color('gray')->size('sm'),
                    TextEntry::make('body')->hiddenLabel()->prose(),
                ]),
            ]),
        ]);
    }

    public static function getRelations(): array
    {
        return [
            \App\Filament\Portal\Resources\Projects\RelationManagers\PaymentsRelationManager::class,
            \App\Filament\Shared\FilesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProjects::route('/'),
            'view' => ViewProject::route('/{record}'),
        ];
    }
}
