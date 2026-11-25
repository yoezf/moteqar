<?php

namespace App\Filament\Support;

use Filament\AvatarProviders\Contracts\AvatarProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

// Profile icon (Heroicons "user" solid) instead of initials like "AM".
class ProfileAvatar implements AvatarProvider
{
    public function get(Model|Authenticatable $record): string
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#E8EFFF"/><g transform="translate(9 9) scale(1.0)" fill="#2563EB"><svg viewBox="0 0 24 24" width="22" height="22"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.751.751 0 0 1-.437-.695Z" clip-rule="evenodd"/></svg></g></svg>';

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }
}
