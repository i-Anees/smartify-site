<?php

namespace App\Http\Middleware;

use App\Support\SiteContent;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $shared = [...parent::share($request), 'flash' => ['success' => fn () => $request->session()->get('success')]];
        if ($request->is('admin', 'admin/*')) {
            return $shared;
        }
        $content = app(SiteContent::class)->published();
        $copy = $content['copy'];
        $email = $copy['contact_details.email'] ?: null;
        $socials = collect(['Instagram' => 'instagram', 'LinkedIn' => 'linkedin', 'Facebook' => 'facebook'])
            ->map(fn (string $key, string $name): ?string => $copy['contact_details.'.$key] ?: null)
            ->filter(fn (?string $url): bool => filled($url))->map(fn (string $url, string $name): array => ['name' => $name, 'url' => $url])->values();

        return [...$shared,
            'siteContent' => $content, 'contactEmail' => $email, 'socialLinks' => $socials,
            'siteRoutes' => collect(['home', 'about', 'services', 'projects', 'process', 'testimonials', 'contact'])->mapWithKeys(fn (string $name): array => [$name => route($name, [], false)]),
            'serviceRoutes' => collect($content['services'])->mapWithKeys(fn (array $service): array => [$service['slug'] => route('services.show', ['service' => $service['slug']], false)]),
        ];
    }
}
