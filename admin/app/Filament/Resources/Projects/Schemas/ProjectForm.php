<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\Lead;
use App\Models\Project;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Proyek')->columns(2)->schema([
                TextInput::make('title')->label('Nama proyek')->required()->columnSpanFull(),
                Select::make('client_id')->label('Klien')->relationship('client', 'name')->searchable()->preload()->required()
                    ->createOptionForm([
                        TextInput::make('name')->label('Nama')->required(),
                        TextInput::make('company')->label('Perusahaan'),
                        TextInput::make('email')->label('Email')->email(),
                        TextInput::make('phone')->label('WhatsApp')->tel(),
                    ]),
                Select::make('service')->label('Jenis layanan')->options(Lead::SERVICES),
                Select::make('status')->label('Tahap')->options(Project::STATUSES)->default('consultation')->required(),
                DatePicker::make('deadline')->label('Tenggat'),
                TextInput::make('agreed_price')->label('Harga disepakati')->numeric()->prefix('Rp')->inputMode('numeric'),
            ]),
            Section::make('Yang diinginkan klien')->schema([
                RichEditor::make('requirements')->label('Kebutuhan, fitur, dan referensi')->columnSpanFull(),
                FileUpload::make('attachments')->label('Berkas (brief, desain, kontrak)')->multiple()->directory('project-files')
                    ->downloadable()->openable()->preserveFilenames()->maxSize(20480)->columnSpanFull(),
            ]),
        ]);
    }
}
