<?php

namespace Database\Seeders;

use App\Models\ContentItem;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            if (SiteSetting::query()->where('key', 'initialized')->exists()) {
                return;
            }
            foreach (config('site-content.collections') as $collection => $definition) {
                foreach ($definition['defaults'] as $index => $data) {
                    $slug = $data['slug'] ?? Str::slug($data['title'] ?? $data['name'] ?? (string) $index);
                    unset($data['id']);
                    ContentItem::query()->firstOrCreate(['collection' => $collection, 'slug' => $slug], [
                        'data' => $data, 'sort_order' => $index * 10, 'published' => true,
                    ]);
                }
            }
            SiteSetting::query()->create(['key' => 'initialized', 'value' => ['ready' => true]]);
        });
    }
}
