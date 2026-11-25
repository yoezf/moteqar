<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLead extends Notification
{
    public function __construct(public Lead $lead) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return \Filament\Notifications\Notification::make()->title('Prospek baru: '.$this->lead->name)->body(\Illuminate\Support\Str::limit((string) $this->lead->details, 120))->icon('heroicon-o-inbox-arrow-down')->getDatabaseMessage();
    }

    public function toMail(object $notifiable): MailMessage
    {
        $l = $this->lead;

        return (new MailMessage)
            ->subject('Prospek baru: '.$l->name)
            ->greeting('Ada prospek baru dari landing page')
            ->line('Nama: '.$l->name.($l->company ? " ({$l->company})" : ''))
            ->line('Email: '.$l->email)
            ->line('Layanan: '.(Lead::SERVICES[$l->service] ?? $l->service ?? '-'))
            ->line('Anggaran: '.($l->budget ?: '-'))
            ->line('Detail: '.($l->details ?: '-'))
            ->action('Buka di dasbor', url('/admin/leads'));
    }
}
