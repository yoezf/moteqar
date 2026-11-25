<?php

namespace App\Http;

use Filament\Auth\Http\Responses\Contracts\LoginResponse;

class RoleLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        $user = auth()->user();

        // Admins may return to the page they asked for; clients always land in the portal.
        return $user->role === 'admin' ? redirect()->intended($user->homeUrl()) : redirect($user->homeUrl());
    }
}
