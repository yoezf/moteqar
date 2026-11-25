<?php

namespace App\Models;

use App\Models\Concerns\ClearsSiteCache;
use Illuminate\Database\Eloquent\Model;

class BuildItem extends Model
{
    use ClearsSiteCache;

    // Icon names that exist in the landing page's icons.js (Heroicons solid).
    public const ICONS = [
        'globe-alt' => 'Globe (website)', 'building-storefront' => 'Toko (kasir)', 'academic-cap' => 'Topi wisuda (sekolah)',
        'device-phone-mobile' => 'Ponsel (aplikasi)', 'clipboard-document-check' => 'Daftar centang (absensi)', 'squares-2x2' => 'Kotak (dasbor)',
        'heart' => 'Hati (undangan)', 'calendar-days' => 'Kalender (planner)', 'banknotes' => 'Uang (tabungan)', 'cog-8-tooth' => 'Roda gigi (industri)',
        'gift' => 'Hadiah', 'sparkles' => 'Kilau', 'puzzle-piece' => 'Puzzle', 'computer-desktop' => 'Komputer', 'chat-bubble-left-right' => 'Percakapan',
        'shield-check' => 'Perisai', 'rocket-launch' => 'Roket', 'briefcase' => 'Tas kerja', 'code-bracket' => 'Kode', 'cpu-chip' => 'Chip', 'paint-brush' => 'Kuas',
    ];

    protected $fillable = ['icon', 'title_id', 'title_en', 'desc_id', 'desc_en', 'sort', 'published'];

    protected $casts = ['published' => 'boolean'];
}
