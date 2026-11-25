<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = ['project_id', 'title', 'amount', 'due_date', 'status', 'paid_at', 'note', 'reminded_at'];

    protected $casts = ['due_date' => 'date', 'paid_at' => 'date'];

    protected static function booted(): void
    {
        $notify = function (Payment $pay, string $kind) {
            try {
                \Illuminate\Support\Facades\Notification::send($pay->project->client->users, new \App\Notifications\InvoiceNotice($pay, $kind));
            } catch (\Throwable $e) {
                report($e);
            }
        };
        static::created(fn (Payment $pay) => $pay->status === 'unpaid' && $notify($pay, 'new'));
        static::updated(fn (Payment $pay) => $pay->wasChanged('status') && $pay->status === 'paid' && $notify($pay, 'paid'));
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
