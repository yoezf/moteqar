<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BuildItem;
use App\Models\FaqItem;
use App\Models\Plan;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/**
 * Public, read-only copy of the landing page content managed in the admin.
 * GET /api/site  (cached for 60 seconds; saving content in the admin clears the cache)
 */
class SiteController extends Controller
{
    public const CACHE_KEY = 'site-content';

    public function __invoke(): JsonResponse
    {
        $data = Cache::remember(self::CACHE_KEY, 60, fn () => $this->build());

        return response()->json($data)->header('Cache-Control', 'public, max-age=60');
    }

    private function build(): array
    {
        $cover = function (?string $path) {
            if (! $path) {
                return null;
            }
            // Files uploaded in the admin live in storage; seeded covers are paths inside the landing page folder.
            return file_exists(storage_path('app/public/'.$path)) ? asset('storage/'.$path) : $path;
        };

        return [
            'builds' => BuildItem::where('published', true)->orderBy('sort')->get()->map(fn ($b) => [
                'icon' => $b->icon,
                'id' => [$b->title_id, $b->desc_id],
                'en' => [$b->title_en, $b->desc_en],
            ])->values(),
            'faq' => FaqItem::where('published', true)->orderBy('sort')->get()->map(fn ($q) => [
                'id' => [$q->question_id, $q->answer_id],
                'en' => [$q->question_en, $q->answer_en],
            ])->values(),
            'plans' => Plan::where('published', true)->orderBy('sort')->get()->map(fn ($p) => [
                'code' => $p->code,
                'name' => $p->name,
                'id' => ['title' => $p->title_id, 'scope' => $p->scope_id ?? []],
                'en' => ['title' => $p->title_en, 'scope' => $p->scope_en ?? []],
            ])->values(),
            'portfolio' => PortfolioItem::where('published', true)->orderBy('sort')->get()->map(fn ($p) => [
                'kind' => $p->kind,
                'url' => $p->url,
                'cover' => $cover($p->cover),
                'tech' => $p->tech ?? [],
                'id' => ['title' => $p->title_id, 'industry' => $p->industry_id, 'overview' => $p->overview_id, 'highlights' => $p->highlights_id ?? []],
                'en' => ['title' => $p->title_en, 'industry' => $p->industry_en, 'overview' => $p->overview_en, 'highlights' => $p->highlights_en ?? []],
            ])->values(),
        ];
    }
}
