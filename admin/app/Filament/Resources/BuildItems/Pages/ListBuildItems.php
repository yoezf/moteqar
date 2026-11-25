<?php

namespace App\Filament\Resources\BuildItems\Pages;

use App\Filament\Resources\BuildItems\BuildItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBuildItems extends ListRecords
{
    protected static string $resource = BuildItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
