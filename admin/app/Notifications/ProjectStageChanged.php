<?php

namespace App\Notifications;

use App\Models\Project;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectStageChanged extends Notification
{
    public function __construct(public Project $project) {}

    private function stage(): string
    {
        return Project::STATUSES[$this->project->status] ?? $this->project->status;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $p = $this->project;

        return (new MailMessage)
            ->subject('Proyek '.$p->title.' masuk tahap '.$this->stage())
            ->greeting('Halo, '.$notifiable->name)
            ->line('Proyek "'.$p->title.'" sekarang berada di tahap **'.$this->stage().'**'.($p->status === 'cancelled' ? '.' : ' ('.$p->progress().'%).'))
            ->action('Lihat progres', url('/portal/projects/'.$p->id));
    }

    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()->title('Tahap baru: '.$this->stage())->body($this->project->title)->icon('heroicon-o-flag')->getDatabaseMessage();
    }
}
