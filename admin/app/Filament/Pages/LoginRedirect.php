<?php

namespace App\Filament\Pages;

use Filament\Pages\SimplePage;

// Unauthenticated visits to /admin and /portal land here and go to the one login page.
class LoginRedirect extends SimplePage
{
    public function mount(): void
    {
        redirect('/login');
    }
}
