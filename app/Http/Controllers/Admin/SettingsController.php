<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveSettingsRequest;
use App\Models\SiteSetting;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Http\RedirectResponse;

class SettingsController extends Controller
{
    public function update(SaveSettingsRequest $request): RedirectResponse
    {
        app(SiteContentSeeder::class)->run();
        $current = SiteSetting::query()->firstOrNew(['key' => 'copy']);
        $current->value = array_replace($current->value ?? [], array_map(fn ($value): string => $value ?? '', $request->validated('values')));
        $current->save();

        return to_route('admin.index')->with('success', 'Website copy and settings saved.');
    }
}
