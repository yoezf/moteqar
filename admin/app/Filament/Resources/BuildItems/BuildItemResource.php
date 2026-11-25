<?php

namespace App\Filament\Resources\BuildItems;

use App\Filament\Resources\BuildItems\Pages\CreateBuildItem;
use App\Filament\Resources\BuildItems\Pages\EditBuildItem;
use App\Filament\Resources\BuildItems\Pages\ListBuildItems;
use App\Filament\Resources\BuildItems\Schemas\BuildItemForm;
use App\Filament\Resources\BuildItems\Tables\BuildItemsTable;
use App\Models\BuildItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BuildItemResource extends Resource
{
    protected static ?string $model = BuildItem::class;

    protected static ?string $modelLabel = 'Yang bisa kami buat';

    protected static ?string $pluralModelLabel = 'Yang bisa kami buat';

    protected static ?string $navigationLabel = 'Yang bisa kami buat';

    protected static string|\UnitEnum|null $navigationGroup = 'Isi landing page';

    protected static ?int $navigationSort = 2;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    public static function form(Schema $schema): Schema
    {
        return BuildItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BuildItemsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBuildItems::route('/'),
            'create' => CreateBuildItem::route('/create'),
            'edit' => EditBuildItem::route('/{record}/edit'),
        ];
    }
}
