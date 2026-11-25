<?php

namespace App\Filament\Portal\Widgets;

use App\Filament\Portal\Resources\Projects\ProjectResource;
use App\Models\Project;
use Filament\Widgets\Widget;

class ActiveProjects extends Widget
{
    protected static ?int $sort = 2;

    protected string $view = 'filament.portal.active-projects';

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        return [
            'projects' => Project::where('client_id', auth()->user()->client_id)->latest()->get(),
            'url' => fn (Project $p) => ProjectResource::getUrl('view', ['record' => $p]),
        ];
    }
}
