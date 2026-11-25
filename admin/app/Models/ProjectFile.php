<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProjectFile extends Model
{
    protected $fillable = ['project_id', 'user_id', 'from_client', 'name', 'path', 'size'];

    protected $casts = ['from_client' => 'boolean'];

    protected static function booted(): void
    {
        static::deleting(fn (ProjectFile $f) => Storage::disk('local')->delete($f->path));
        static::created(function (ProjectFile $f) {
            if (! $f->from_client) {
                return;
            }
            try {
                \Illuminate\Support\Facades\Notification::send(User::where('role', 'admin')->get(), new \App\Notifications\ClientFileUploaded($f));
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
