<?php

namespace App\Notifications;

use App\Models\ProjectFile;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClientFileUploaded extends Notification
{
    public function __construct(public ProjectFile $file) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $p = $this->file->project;

        return (new MailMessage)
            ->subject('Berkas baru dari klien: '.$p->title)
            ->line(($p->client->name ?? 'Klien').' mengunggah berkas "'.$this->file->name.'" pada proyek "'.$p->title.'".')
            ->action('Buka proyek', url('/admin/projects/'.$p->id.'/edit'));
    }

    public function toDatabase(object $notifiable): array
    {
        $p = $this->file->project;

        return FilamentNotification::make()->title('Berkas baru dari klien')->body($this->file->name.' • '.$p->title)->icon('heroicon-o-paper-clip')->getDatabaseMessage();
    }
}
