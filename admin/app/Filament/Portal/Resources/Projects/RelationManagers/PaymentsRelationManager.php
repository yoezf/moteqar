<?php

namespace App\Filament\Portal\Resources\Projects\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

// Read-only list of invoices for the client.
class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    protected static ?string $title = 'Tagihan';

    public function table(Table $table): Table
    {
        return $table
            ->description(fn () => 'Dibayar Rp '.number_format($this->getOwnerRecord()->paidTotal(), 0, ',', '.').' dari Rp '.number_format((int) $this->getOwnerRecord()->agreed_price, 0, ',', '.'))
            ->paginated(false)
            ->columns([
                TextColumn::make('title')->label('Tagihan')->weight('bold')->description(fn ($record) => $record->note)->wrap(),
                TextColumn::make('amount')->label('Jumlah')->money('IDR', locale: 'id'),
                TextColumn::make('due_date')->label('Jatuh tempo')->date('d M Y'),
                TextColumn::make('status')->label('Status')->badge()
                    ->formatStateUsing(fn ($state) => $state === 'paid' ? 'Lunas' : 'Belum dibayar')->color(fn ($state) => $state === 'paid' ? 'success' : 'warning'),
            ])
            ->emptyStateHeading('Belum ada tagihan');
    }
}
