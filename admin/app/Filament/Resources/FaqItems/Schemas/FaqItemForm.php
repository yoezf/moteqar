<?php

namespace App\Filament\Resources\FaqItems\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FaqItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->schema([
                TextInput::make('question_id')->label('Pertanyaan (Indonesia)')->required(),
                TextInput::make('question_en')->label('Question (English)')->required(),
                Textarea::make('answer_id')->label('Jawaban (Indonesia)')->required()->rows(4),
                Textarea::make('answer_en')->label('Answer (English)')->required()->rows(4),
                TextInput::make('sort')->label('Urutan')->numeric()->default(0),
                Toggle::make('published')->label('Tampil di situs')->default(true),
            ]),
        ]);
    }
}
