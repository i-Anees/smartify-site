<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomepageTest extends TestCase
{
    public function test_homepage_has_no_invented_contact_details_when_unconfigured(): void
    {
        config()->set('services.smartify.contact_email', null);
        config()->set('services.smartify.socials', ['Instagram' => null, 'LinkedIn' => '']);

        $response = $this->get('/');

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->where('contactEmail', null)
            ->has('socialLinks', 0)
        );
    }

    public function test_homepage_exposes_configured_business_links_without_empty_profiles(): void
    {
        config()->set('services.smartify.contact_email', 'studio@example.test');
        config()->set('services.smartify.socials', [
            'Instagram' => null,
            'LinkedIn' => 'https://www.linkedin.com/company/example-studio',
        ]);

        $response = $this->get('/');

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->where('contactEmail', 'studio@example.test')
            ->has('socialLinks', 1)
            ->where('socialLinks.0.name', 'LinkedIn')
            ->where('socialLinks.0.url', 'https://www.linkedin.com/company/example-studio')
        );
    }
}
