<?php

namespace Database\Seeders;

use App\Models\BuildItem;
use App\Models\FaqItem;
use App\Models\Plan;
use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;

/** Loads the content that is on the landing page today (exported from website/app.js) so the admin starts filled. */
class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $d = json_decode(file_get_contents(database_path('seeders/data/site.json')), true);

        if (! BuildItem::count()) {
            foreach ($d['builds'] as $i => $b) {
                BuildItem::create($b + ['sort' => $i + 1]);
            }
        }
        if (! FaqItem::count()) {
            foreach ($d['faq'] as $i => $q) {
                FaqItem::create($q + ['sort' => $i + 1]);
            }
        }
        if (! Plan::count()) {
            foreach ($d['plans'] as $i => $p) {
                Plan::create($p + ['sort' => $i + 1]);
            }
        }
        if (! PortfolioItem::count()) {
            foreach ($d['portfolio'] as $i => $p) {
                PortfolioItem::create($p + ['sort' => $i + 1]);
            }
        }
    }
}
