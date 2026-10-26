<?php

namespace App\Support;

use App\Models\ContentItem;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class SiteContent
{
    private ?array $snapshot = null;

    private ?Request $snapshotRequest = null;

    public function published(): array
    {
        if ($this->snapshot !== null && $this->snapshotRequest === request()) {
            return $this->snapshot;
        }
        $this->snapshotRequest = request();
        $copy = collect(config('site-content.copy'))->mapWithKeys(fn (array $field, string $key): array => [$key => $field['default']])->all();
        $copy['contact_details.email'] = config('services.smartify.contact_email') ?? '';
        foreach (['Instagram', 'LinkedIn', 'Facebook'] as $name) {
            $copy['contact_details.'.strtolower($name)] = config('services.smartify.socials.'.$name) ?? '';
        }
        $initialized = Schema::hasTable('site_settings') && SiteSetting::query()->where('key', 'initialized')->exists();
        $items = $initialized ? ContentItem::query()->where('published', true)->orderBy('sort_order')->orderBy('id')->get()->groupBy('collection') : collect();
        if ($initialized) {
            $copy = array_replace($copy, SiteSetting::query()->where('key', 'copy')->value('value') ?? []);
        }
        $result = ['copy' => $copy];
        foreach (config('site-content.collections') as $key => $definition) {
            $result[$key] = $initialized
                ? ($items->get($key, collect())->map(fn (ContentItem $item): array => [...$item->data, 'id' => (string) $item->id, 'slug' => $item->slug])->values()->all())
                : $definition['defaults'];
        }

        return $this->snapshot = $result;
    }
}
