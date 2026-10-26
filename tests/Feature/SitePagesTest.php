<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class SitePagesTest extends TestCase
{
    public static function pages(): array
    {
        return [
            'about' => ['/about', 'About'],
            'services' => ['/services', 'Services'],
            'projects' => ['/projects', 'Projects'],
            'process' => ['/process', 'Process'],
            'testimonials' => ['/testimonials', 'Testimonials'],
            'contact' => ['/contact', 'Contact'],
        ];
    }

    #[DataProvider('pages')]
    public function test_page_renders_its_inertia_component_with_shared_navigation(string $url, string $component): void
    {
        $response = $this->get($url);

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component($component)
            ->where('siteRoutes.home', '/')
            ->where('siteRoutes.contact', '/contact')
            ->where('serviceRoutes.web-development', '/services/web-development')
        );
    }

    public static function services(): array
    {
        return array_map(fn (string $slug): array => [$slug], [
            'web-development', 'mobile-apps', 'ui-ux-design', 'branding', 'digital-marketing', 'it-solutions',
        ]);
    }

    #[DataProvider('services')]
    public function test_service_detail_renders_the_requested_service(string $slug): void
    {
        $response = $this->get('/services/'.$slug);

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('ServiceDetail')
            ->where('serviceSlug', $slug)
        );
    }

    public function test_unknown_service_returns_not_found(): void
    {
        $this->get('/services/unknown-service')->assertNotFound();
    }
}
