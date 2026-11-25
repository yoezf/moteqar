<?php

namespace App\Filament\Portal\Resources\Projects\Pages;

use App\Filament\Portal\Resources\Projects\ProjectResource;
use Filament\Resources\Pages\ViewRecord;

class ViewProject extends ViewRecord
{
    protected static string $resource = ProjectResource::class;

    public function getTitle(): string
    {
        return $this->record->title;
    }
}
