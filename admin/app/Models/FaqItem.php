<?php

namespace App\Models;

use App\Models\Concerns\ClearsSiteCache;
use Illuminate\Database\Eloquent\Model;

class FaqItem extends Model
{
    use ClearsSiteCache;

    protected $fillable = ['question_id', 'question_en', 'answer_id', 'answer_en', 'sort', 'published'];

    protected $casts = ['published' => 'boolean'];
}
