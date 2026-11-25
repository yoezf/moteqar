<?php

namespace App\Notifications;

use App\Models\Payment;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// kind: new (invoice created), paid (payment received), due (reminder before or after the due date)
class InvoiceNotice extends Notification
{
    public function __construct(public Payment $payment, public string $kind) {}

    private function rp(): string
    {
        return 'Rp '.number_format($this->payment->amount, 0, ',', '.');
    }

    private function subject(): string
    {
        return match ($this->kind) {
            'paid' => 'Pembayaran diterima: '.$this->payment->title,
            'due' => 'Pengingat tagihan: '.$this->payment->title,
            default => 'Tagihan baru: '.$this->payment->title,
        };
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $pay = $this->payment;
        $mail = (new MailMessage)->subject($this->subject())->greeting('Halo, '.$notifiable->name);

        match ($this->kind) {
            'paid' => $mail->line('Pembayaran **'.$pay->title.'** sebesar '.$this->rp().' untuk proyek "'.$pay->project->title.'" sudah kami terima. Terima kasih!'),
            'due' => $mail->line('Pengingat: tagihan **'.$pay->title.'** sebesar '.$this->rp().' untuk proyek "'.$pay->project->title.'"'.($pay->due_date ? ($pay->due_date->isPast() ? ' sudah lewat jatuh tempo ('.$pay->due_date->translatedFormat('d M Y').').' : ' jatuh tempo pada '.$pay->due_date->translatedFormat('d M Y').'.') : '.')),
            default => $mail->line('Ada tagihan baru **'.$pay->title.'** sebesar '.$this->rp().' untuk proyek "'.$pay->project->title.'"'.($pay->due_date ? ', jatuh tempo '.$pay->due_date->translatedFormat('d M Y').'.' : '.')),
        };

        if ($this->kind !== 'paid' && $pay->note) {
            $mail->line($pay->note);
        }

        return $mail->action('Lihat tagihan', url('/portal/projects/'.$pay->project_id));
    }

    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()->title($this->subject())->body($this->rp().' • '.$this->payment->project->title)->icon('heroicon-o-banknotes')->getDatabaseMessage();
    }
}
