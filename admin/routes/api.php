<?php

use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Route;

// Used by the landing page (Moteqar/website). Both are public; the form is rate limited and has a honeypot.
Route::post('/leads', [LeadController::class, 'store'])->middleware('throttle:8,1');
Route::get('/site', SiteController::class);
