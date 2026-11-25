<?php

namespace App\Models\Concerns;

use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Cache;

trait ClearsSiteCache
{
    protected static function bootClearsSiteCache(): void
    {
        $forget = fn () => Cache::forget(SiteController::CACHE_KEY);
        static::saved($forget);
        static::deleted($forget);
    }
}
