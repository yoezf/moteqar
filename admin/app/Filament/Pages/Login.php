<?php

namespace App\Filament\Pages;

use Filament\Auth\Pages\Login as BaseLogin;
use Filament\Forms\Components\Checkbox;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\Text;
use Illuminate\Support\HtmlString;
use Illuminate\Contracts\Auth\Authenticatable;

// The one login page for everybody: admins and clients sign in here and are sent to their own area.
class Login extends BaseLogin
{
    public function mount(): void
    {
        if (auth()->check()) {
            redirect(auth()->user()->homeUrl());
        }

        $this->form->fill();
    }

    protected function isUserAllowedToAccessPanel(Authenticatable $user): bool
    {
        return in_array($user->role, ['admin', 'client'], true) && ($user->role === 'admin' || $user->client_id !== null);
    }

    // "Lupa kata sandi?" sits on the same row as "Ingat saya" instead of above the password field.
    protected function getPasswordFormComponent(): Component
    {
        return parent::getPasswordFormComponent()->hint(null);
    }

    protected function getRememberFormComponent(): Component
    {
        $link = new HtmlString('<a class="mq-forgot" href="'.e(filament()->getRequestPasswordResetUrl()).'" tabindex="-1">Lupa kata sandi?</a>');

        return Flex::make([
            Checkbox::make('remember')->label(__('filament-panels::auth/pages/login.form.remember.label')),
            Text::make($link)->grow(false),
        ])->from('default')->verticalAlignment(\Filament\Support\Enums\VerticalAlignment::Center);
    }
}
