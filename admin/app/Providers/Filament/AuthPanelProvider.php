<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

// The single login page (domain.com/login) for admins and clients; it has no pages of its own.
class AuthPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('auth')
            ->path('')
            ->login(\App\Filament\Pages\Login::class)
            ->passwordReset()
            ->darkMode(false)
            ->multiFactorAuthentication([\Filament\Auth\MultiFactor\App\AppAuthentication::make()->recoverable()])
            ->defaultAvatarProvider(\App\Filament\Support\ProfileAvatar::class)
            ->brandName('MOTEQAR')
            ->brandLogo(fn () => view('filament.brand', ['label' => 'Portal Klien']))
            ->brandLogoHeight('1.6rem')
            ->font('Plus Jakarta Sans')
            ->colors(['primary' => Color::Blue])
            ->renderHook(PanelsRenderHook::HEAD_END, fn () => view('filament.theme'))
            ->renderHook(PanelsRenderHook::AUTH_LOGIN_FORM_AFTER, fn () => view('filament.google-button'))
            ->pages([])
            ->widgets([])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([Authenticate::class]);
    }
}
