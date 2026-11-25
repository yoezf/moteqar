<?php

namespace App\Models;

use App\Models\Concerns\ClearsSiteCache;
use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    use ClearsSiteCache;

    protected $fillable = ['kind', 'title_id', 'title_en', 'industry_id', 'industry_en', 'overview_id', 'overview_en', 'highlights_id', 'highlights_en', 'tech', 'url', 'cover', 'sort', 'published'];

    protected $casts = ['highlights_id' => 'array', 'highlights_en' => 'array', 'tech' => 'array', 'published' => 'boolean'];
}
