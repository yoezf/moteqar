<?php

namespace App\Models;

use App\Models\Concerns\ClearsSiteCache;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use ClearsSiteCache;

    protected $fillable = ['code', 'name', 'title_id', 'title_en', 'scope_id', 'scope_en', 'sort', 'published'];

    protected $casts = ['scope_id' => 'array', 'scope_en' => 'array', 'published' => 'boolean'];
}
