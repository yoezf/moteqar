<?php

namespace App\Filament\Resources\BuildItems\Pages;

use App\Filament\Resources\BuildItems\BuildItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBuildItem extends EditRecord
{
    protected static string $resource = BuildItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
