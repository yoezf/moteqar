<?php

namespace App\Filament\Resources\Leads\Tables;

use App\Models\Client;
use App\Models\Lead;
use App\Models\Project;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class LeadsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->label('Nama')->description(fn (Lead $r) => $r->company)->searchable(['name', 'company'])->weight('bold'),
                TextColumn::make('email')->label('Email')->searchable()->copyable(),
                TextColumn::make('service')->label('Layanan')->formatStateUsing(fn ($state) => Lead::SERVICES[$state] ?? $state)->toggleable(),
                TextColumn::make('budget')->label('Anggaran')->toggleable(),
                TextColumn::make('status')->label('Status')->badge()
                    ->formatStateUsing(fn ($state) => Lead::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => Lead::STATUS_COLORS[$state] ?? 'gray'),
                TextColumn::make('client.name')->label('Klien')->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')->label('Masuk')->since()->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->label('Status')->options(Lead::STATUSES),
                SelectFilter::make('service')->label('Layanan')->options(Lead::SERVICES),
            ])
            ->recordActions([
                Action::make('toProject')
                    ->label('Jadikan proyek')
                    ->icon(Heroicon::OutlinedRocketLaunch)
                    ->color('success')
                    ->visible(fn (Lead $r) => $r->status !== 'won')
                    ->requiresConfirmation()
                    ->modalHeading('Jadikan proyek?')
                    ->modalDescription('Klien dan proyek baru dibuat dari prospek ini. Statusnya menjadi Deal.')
                    ->action(function (Lead $record) {
                        $client = $record->client ?? Client::firstOrCreate(
                            ['email' => $record->email],
                            ['name' => $record->name, 'company' => $record->company],
                        );
                        Project::create([
                            'client_id' => $client->id,
                            'lead_id' => $record->id,
                            'title' => $record->company ?: $record->name,
                            'service' => $record->service,
                            'requirements' => nl2br(e($record->details)),
                            'status' => 'consultation',
                        ]);
                        $record->update(['status' => 'won', 'client_id' => $client->id]);
                        Notification::make()->title('Proyek dibuat')->body('Lihat di menu Proyek.')->success()->send();
                    }),
                EditAction::make()->label('Buka'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }
}
