<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveContentRequest;
use App\Models\ContentItem;
use App\Support\SiteContent;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function index(Request $request, SiteContent $content): Response
    {
        return Inertia::render('AdminDashboard', [
            'catalog' => config('site-content'),
            'items' => ContentItem::query()->orderBy('sort_order')->orderBy('id')->get()->map(fn (ContentItem $item): array => [
                'id' => $item->id, 'collection' => $item->collection, 'data' => $item->data, 'published' => $item->published, 'sort_order' => $item->sort_order,
                'updateUrl' => route('admin.content.update', [$item->collection, $item], false), 'deleteUrl' => route('admin.content.destroy', [$item->collection, $item], false),
            ]),
            'values' => $content->published()['copy'],
            'adminName' => $request->user()->name,
            'websiteUrl' => route('home', [], false),
            'adminRoutes' => ['settings' => route('admin.settings.update', [], false), 'media' => route('admin.media.store', [], false), 'logout' => route('admin.session.destroy', [], false),
                'create' => collect(array_keys(config('site-content.collections')))->mapWithKeys(fn (string $key): array => [$key => route('admin.content.store', $key, false)])],
        ]);
    }

    public function store(SaveContentRequest $request, string $collection): RedirectResponse
    {
        app(SiteContentSeeder::class)->run();
        $data = $request->validated('data');
        ContentItem::query()->create([
            'collection' => $collection, 'slug' => $data['slug'] ?? Str::uuid()->toString(), 'data' => $data,
            'sort_order' => $request->integer('sort_order'), 'published' => $request->boolean('published'),
        ]);

        return to_route('admin.index')->with('success', 'Content saved. Published entries are now visible on the website.');
    }

    public function update(SaveContentRequest $request, string $collection, ContentItem $item): RedirectResponse
    {
        $data = $request->validated('data');
        $item->update(['slug' => $data['slug'] ?? $item->slug, 'data' => $data, 'sort_order' => $request->integer('sort_order'), 'published' => $request->boolean('published')]);

        return to_route('admin.index')->with('success', 'Changes saved.');
    }

    public function destroy(string $collection, ContentItem $item): RedirectResponse
    {
        abort_unless($item->collection === $collection, 404);
        $item->delete();

        return to_route('admin.index')->with('success', 'Entry deleted. Shared image files have been kept.');
    }
}
