<?php

use App\Http\Controllers\GoogleLoginController;
use Illuminate\Support\Facades\Route;

// Local development only: serve the landing page from ../website at "/" (in production it lives in public/ and the web server serves it).
if (app()->environment('local') && is_dir(base_path('../website'))) {
    $site = realpath(base_path('../website'));
    Route::get('/', fn () => response()->file($site.'/index.html'));
    Route::fallback(function () use ($site) {
        $file = realpath($site.'/'.request()->path());
        abort_unless($file && str_starts_with($file, $site.DIRECTORY_SEPARATOR) && is_file($file), 404);

        $types = ['js' => 'application/javascript', 'css' => 'text/css', 'html' => 'text/html', 'xml' => 'application/xml', 'txt' => 'text/plain'];

        return response()->file($file, ['Content-Type' => $types[pathinfo($file, PATHINFO_EXTENSION)] ?? (mime_content_type($file) ?: 'application/octet-stream')]);
    });
}

Route::get('/auth/google', [GoogleLoginController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleLoginController::class, 'callback']);

// Private project files: admins, or the client who owns the project.
Route::get('/files/{file}', function (\App\Models\ProjectFile $file) {
    $user = auth()->user();
    abort_unless($user && ($user->role === 'admin' || ($user->client_id && $user->client_id === $file->project->client_id)), 403);

    return \Illuminate\Support\Facades\Storage::disk('local')->download($file->path, $file->name);
});
