<?php

namespace Tests\Feature;

use App\Models\ContentItem;
use App\Models\User;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use LazilyRefreshDatabase;

    private function signIn(): User
    {
        $user = User::factory()->create(['is_admin' => true]);
        $this->actingAs($user);
        $this->seed(SiteContentSeeder::class);

        return $user;
    }

    public function test_dashboard_is_available_only_to_admins_and_exposes_editing_routes(): void
    {
        $this->signIn();
        $this->get('/admin')->assertOk()->assertInertia(fn (Assert $page) => $page->component('AdminDashboard')->has('catalog.collections.team.fields.portrait')->has('items', 16)->where('adminRoutes.create.team', '/admin/content/team'));
    }

    public function test_team_profiles_can_be_drafted_published_ordered_updated_and_deleted(): void
    {
        $this->signIn();
        $data = ['name' => 'Approved Person', 'role' => 'Creative Director', 'bio' => 'A short approved biography.', 'portrait' => '/images/brand/ai-robot-640.webp', 'portraitFocus' => 25, 'linkedin' => 'https://www.linkedin.com/in/approved-person'];
        $this->post('/admin/content/team', ['data' => $data, 'published' => false, 'sort_order' => 20])->assertRedirect('/admin');
        $item = ContentItem::query()->where('collection', 'team')->firstOrFail();
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('siteContent.team', 0));
        $this->put('/admin/content/team/'.$item->id, ['data' => $data, 'published' => true, 'sort_order' => 20])->assertRedirect('/admin');
        ContentItem::factory()->create(['published' => true, 'sort_order' => 0]);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('siteContent.team', 2)->where('siteContent.team.1.name', 'Approved Person')->where('siteContent.team.1.portraitFocus', 25));
        $this->delete('/admin/content/team/'.$item->id)->assertRedirect('/admin');
        $this->assertDatabaseMissing('content_items', ['id' => $item->id]);
    }

    public function test_team_publishing_requires_a_real_image_and_rejects_invalid_crop_and_unsafe_urls(): void
    {
        $this->signIn();
        $this->post('/admin/content/team', ['data' => ['name' => 'Person', 'role' => 'Designer', 'bio' => 'Biography', 'portrait' => '', 'portraitFocus' => 120, 'linkedin' => 'javascript:alert(1)'], 'published' => true, 'sort_order' => 0])->assertSessionHasErrors(['data.portrait', 'data.portraitFocus', 'data.linkedin']);
        $this->assertDatabaseCount('content_items', 16);
    }

    public function test_page_copy_and_contact_settings_are_used_by_the_public_site(): void
    {
        $this->signIn();
        $this->put('/admin/settings', ['values' => ['hero.heading' => 'An approved new headline', 'contact_details.email' => 'hello@example.test', 'contact_details.linkedin' => 'https://www.linkedin.com/company/studio']])->assertRedirect('/admin');
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('siteContent.copy', fn (Collection $copy): bool => $copy['hero.heading'] === 'An approved new headline')->where('contactEmail', 'hello@example.test')->where('socialLinks.0.name', 'LinkedIn'));
        $this->put('/admin/settings', ['values' => ['contact_details.email' => '']])->assertRedirect('/admin');
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('contactEmail', null));
    }

    public function test_published_services_define_their_public_routes_and_drafts_return_404(): void
    {
        $this->signIn();
        $data = config('site-content.collections.services.defaults.0');
        $data['slug'] = 'automation';
        $data['title'] = 'Automation';
        $this->post('/admin/content/services', ['data' => $data, 'published' => true, 'sort_order' => 80])->assertRedirect('/admin');
        $item = ContentItem::query()->where('slug', 'automation')->firstOrFail();
        $this->get('/services/automation')->assertOk()->assertInertia(fn (Assert $page) => $page->where('serviceRoutes.automation', '/services/automation'));
        $this->put('/admin/content/services/'.$item->id, ['data' => $data, 'published' => false, 'sort_order' => 80])->assertRedirect('/admin');
        $this->get('/services/automation')->assertNotFound();
        $this->post('/admin/content/services', ['data' => $data, 'published' => false, 'sort_order' => 80])->assertSessionHasErrors('data.slug');
    }

    public function test_records_cannot_be_modified_through_another_collection(): void
    {
        $this->signIn();
        $item = ContentItem::factory()->create();
        $this->delete('/admin/content/projects/'.$item->id)->assertNotFound();
        $this->put('/admin/content/projects/'.$item->id, [])->assertNotFound();
        $this->assertDatabaseHas('content_items', ['id' => $item->id]);
    }

    public function test_portrait_uploads_are_validated_stored_and_can_be_published(): void
    {
        Storage::fake('public');
        $this->signIn();
        $file = UploadedFile::fake()->createWithContent('portrait.webp', file_get_contents(public_path('images/brand/ai-robot-640.webp')));
        $response = $this->postJson('/admin/media', ['image' => $file])->assertCreated();
        $path = $response->json('url');
        Storage::disk('public')->assertExists(substr($path, strlen('/storage/')));
        $this->post('/admin/content/team', ['data' => ['name' => 'Approved Person', 'role' => 'Designer', 'bio' => 'Biography', 'portrait' => $path], 'published' => true, 'sort_order' => 0])->assertRedirect('/admin');
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('siteContent.team.0.portrait', $path));
        $this->postJson('/admin/media', ['image' => UploadedFile::fake()->createWithContent('script.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')])->assertUnprocessable()->assertJsonValidationErrors('image');
    }

    public function test_unpublished_testimonials_never_reach_the_public_payload(): void
    {
        $this->signIn();
        ContentItem::factory()->create(['collection' => 'testimonials', 'data' => ['name' => 'Client', 'quote' => 'A private unapproved quote.'], 'published' => false]);
        $this->get('/testimonials')->assertInertia(fn (Assert $page) => $page->has('siteContent.testimonials', 0));
    }

    public function test_unknown_fields_and_arbitrary_image_paths_are_rejected(): void
    {
        $this->signIn();
        $this->put('/admin/settings', ['values' => ['hero.image' => '/storage/../.env']])->assertSessionHasErrors('values.hero.image');
        $this->put('/admin/settings', ['values' => ['unknown.key' => 'unsupported']])->assertSessionHasErrors('values');
    }

    public function test_projects_process_steps_and_testimonials_use_the_same_publication_controls(): void
    {
        $this->signIn();
        $project = ContentItem::query()->where('collection', 'projects')->firstOrFail();
        $projectData = [...$project->data, 'title' => 'A real approved project', 'concept' => false];
        $this->put('/admin/content/projects/'.$project->id, ['data' => $projectData, 'published' => true, 'sort_order' => 0])->assertRedirect('/admin');
        $this->post('/admin/content/process', ['data' => ['title' => 'Ongoing care', 'description' => 'Continued support after launch.', 'outcome' => 'A shared improvement plan.'], 'published' => true, 'sort_order' => 100])->assertRedirect('/admin');
        $this->post('/admin/content/testimonials', ['data' => ['name' => 'Approved client', 'role' => 'Director', 'company' => 'Example studio', 'quote' => 'An approved client experience.'], 'published' => true, 'sort_order' => 0])->assertRedirect('/admin');
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('siteContent.projects.0.title', 'A real approved project')
            ->where('siteContent.projects.0.concept', false)
            ->where('siteContent.process.5.title', 'Ongoing care')
            ->where('siteContent.testimonials.0.quote', 'An approved client experience.')
        );
    }

    public function test_deleting_all_services_does_not_restore_the_default_entries(): void
    {
        $this->signIn();
        ContentItem::query()->where('collection', 'services')->delete();
        $this->seed(SiteContentSeeder::class);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('siteContent.services', 0)->has('serviceRoutes', 0));
        $this->get('/services/web-development')->assertNotFound();
    }
}
