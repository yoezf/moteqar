<?php

namespace App\Notifications;

use App\Models\ProjectNote;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectUpdate extends Notification
{
    public function __construct(public ProjectNote $note) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return \Filament\Notifications\Notification::make()->title('Kabar baru: '.$this->note->project->title)->body(\Illuminate\Support\Str::limit($this->note->body, 120))->icon('heroicon-o-bell')->getDatabaseMessage();
    }

    public function toMail(object $notifiable): MailMessage
    {
        $p = $this->note->project;

        return (new MailMessage)
            ->subject('Kabar terbaru proyek '.$p->title)
            ->greeting('Halo, '.$notifiable->name)
            ->line('Ada kabar baru untuk proyek "'.$p->title.'":')
            ->line($this->note->body)
            ->line('Tahap saat ini: '.(\App\Models\Project::STATUSES[$p->status] ?? $p->status).' ('.$p->progress().'%)')
            ->action('Lihat progres', url('/portal/projects/'.$p->id));
    }
}
