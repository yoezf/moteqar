<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    // Same four steps as the "Proses" section of the landing page, plus done / cancelled.
    public const STATUSES = [
        'consultation' => 'Konsultasi',
        'quotation' => 'Penawaran',
        'development' => 'Pengerjaan',
        'revision' => 'Revisi',
        'done' => 'Selesai',
        'cancelled' => 'Dibatalkan',
    ];

    public const STATUS_COLORS = [
        'consultation' => 'info',
        'quotation' => 'warning',
        'development' => 'primary',
        'revision' => 'warning',
        'done' => 'success',
        'cancelled' => 'gray',
    ];

    protected $fillable = ['client_id', 'lead_id', 'title', 'service', 'requirements', 'attachments', 'agreed_price', 'deadline', 'status'];

    protected $casts = ['attachments' => 'array', 'deadline' => 'date'];

    protected static function booted(): void
    {
        static::updated(function (Project $p) {
            if (! $p->wasChanged('status')) {
                return;
            }
            try {
                \Illuminate\Support\Facades\Notification::send($p->client->users, new \App\Notifications\ProjectStageChanged($p));
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(ProjectNote::class)->latest();
    }

    // The lead form stores a service key (e.g. "webapp"); show its label.
    public function serviceLabel(): ?string
    {
        return Lead::SERVICES[$this->service] ?? $this->service;
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class)->latest();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class)->orderBy('due_date');
    }

    public function paidTotal(): int
    {
        return (int) $this->payments()->where('status', 'paid')->sum('amount');
    }

    public function publicNotes(): HasMany
    {
        return $this->hasMany(ProjectNote::class)->where('is_public', true)->latest();
    }

    // Percentage shown to the client in the portal.
    public function progress(): int
    {
        return ['consultation' => 15, 'quotation' => 35, 'development' => 65, 'revision' => 85, 'done' => 100][$this->status] ?? 0;
    }

    public function isActive(): bool
    {
        return ! in_array($this->status, ['done', 'cancelled'], true);
    }
}
