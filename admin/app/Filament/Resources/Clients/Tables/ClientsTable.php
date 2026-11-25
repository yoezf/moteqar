<?php

namespace App\Filament\Resources\Clients\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Illuminate\Support\Str;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ClientsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->label('Nama')->description(fn ($record) => $record->company)->searchable(['name', 'company'])->weight('bold'),
                TextColumn::make('email')->label('Email')->searchable()->copyable(),
                TextColumn::make('phone')->label('WhatsApp')->copyable(),
                TextColumn::make('projects_count')->label('Proyek')->counts('projects')->badge(),
                TextColumn::make('created_at')->label('Sejak')->date('d M Y')->sortable(),
            ])
            ->recordActions([
                Action::make('portal')->label('Akun portal')->icon('heroicon-o-key')->color('gray')
                    ->modalHeading('Akun portal klien')
                    ->modalDescription('Klien masuk di halaman /login untuk melihat progres proyeknya. Mengisi lagi akan mengganti password.')
                    ->fillForm(fn ($record) => ['email' => $record->users()->value('email') ?? $record->email, 'password' => Str::password(10, symbols: false)])
                    ->schema([
                        TextInput::make('email')->label('Email login')->email()->required(),
                        TextInput::make('password')->label('Password')->required()->minLength(8)->helperText('Salin dan kirim ke klien sekarang, password tidak bisa dilihat lagi.'),
                    ])
                    ->action(function (array $data, $record) {
                        User::updateOrCreate(
                            ['client_id' => $record->id, 'role' => 'client'],
                            ['name' => $record->name, 'email' => $data['email'], 'password' => $data['password']],
                        );
                        Notification::make()->success()->title('Akun portal disimpan')->send();
                    }),
                EditAction::make()->label('Buka'),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
