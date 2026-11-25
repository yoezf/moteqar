<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// Auto-reply to the person who filled the form on the landing page.
class LeadReceipt extends Notification
{
    public function __construct(public Lead $lead) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $l = $this->lead;

        return (new MailMessage)
            ->subject('Permintaan Anda sudah kami terima')
            ->greeting('Halo, '.$l->name.'!')
            ->line('Terima kasih sudah menghubungi MOTEQAR. Permintaan Anda sudah kami terima dan tim kami akan membalas secepatnya, biasanya dalam 1x24 jam kerja.')
            ->line('Ringkasan yang Anda kirim:')
            ->line('Layanan: '.(Lead::SERVICES[$l->service] ?? $l->service ?? '-'))
            ->line('Kebutuhan: '.($l->details ?: '-'))
            ->line('Kalau ada tambahan, cukup balas email ini.');
    }
}
