<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

// "Masuk dengan Google": only signs in accounts that already exist (admins, or clients made from the Klien page).
// There is no sign-up, so a Google account with an unknown email is refused.
class GoogleLoginController extends Controller
{
    public function redirect(): RedirectResponse
    {
        abort_unless(config('services.google.client_id'), 404);

        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        abort_unless(config('services.google.client_id'), 404);

        try {
            $google = Socialite::driver('google')->user();
        } catch (\Throwable) {
            return $this->fail('Login Google dibatalkan atau gagal. Silakan coba lagi.');
        }

        $user = ($google->user['email_verified'] ?? false) ? User::where('email', $google->getEmail())->first() : null;

        if (! $user || ! in_array($user->role, ['admin', 'client'], true) || ($user->role === 'client' && ! $user->client_id)) {
            return $this->fail('Akun Google ini belum terdaftar. Hubungi MOTEQAR untuk dibuatkan akun.');
        }

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        return $user->role === 'admin' ? redirect()->intended($user->homeUrl()) : redirect($user->homeUrl());
    }

    private function fail(string $message): RedirectResponse
    {
        return redirect('/login')->with('google_error', $message);
    }
}
