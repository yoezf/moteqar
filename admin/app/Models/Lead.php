<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    public const STATUSES = [
        'new' => 'Baru',
        'contacted' => 'Sudah dihubungi',
        'proposal' => 'Penawaran dikirim',
        'won' => 'Deal',
        'lost' => 'Batal',
    ];

    public const STATUS_COLORS = [
        'new' => 'info',
        'contacted' => 'warning',
        'proposal' => 'primary',
        'won' => 'success',
        'lost' => 'gray',
    ];

    // Same keys as the service dropdown on the landing page form.
    public const SERVICES = [
        'website' => 'Pembuatan Website',
        'webapp' => 'Aplikasi Web',
        'mobile' => 'Aplikasi Mobile',
        'software' => 'Software Kustom',
        'design' => 'Desain UI/UX',
        'support' => 'Dukungan & Pemeliharaan',
    ];

    protected static function booted(): void
    {
        // Email every admin; a mail failure must never lose the lead.
        static::created(function (Lead $lead) {
            try {
                \Illuminate\Support\Facades\Notification::send(User::where('role', 'admin')->get(), new \App\Notifications\NewLead($lead));
                if ($lead->source === 'landing') { // only the public form gets an auto-reply
                    \Illuminate\Support\Facades\Notification::route('mail', $lead->email)->notify(new \App\Notifications\LeadReceipt($lead));
                }
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    protected $fillable = ['name', 'email', 'company', 'service', 'budget', 'package', 'details', 'source', 'status', 'notes', 'client_id'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
