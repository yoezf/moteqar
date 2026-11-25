<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectNote extends Model
{
    protected $casts = ['is_public' => 'boolean'];

    protected $fillable = ['project_id', 'user_id', 'body', 'is_public'];

    protected static function booted(): void
    {
        // Tell the client when a note becomes visible to them (new public note, or an internal one switched to public).
        $notify = function (ProjectNote $note) {
            try {
                \Illuminate\Support\Facades\Notification::send($note->project->client->users, new \App\Notifications\ProjectUpdate($note));
            } catch (\Throwable $e) {
                report($e);
            }
        };
        static::created(fn (ProjectNote $n) => $n->is_public && $notify($n));
        static::updated(fn (ProjectNote $n) => $n->wasChanged('is_public') && $n->is_public && $notify($n));
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
