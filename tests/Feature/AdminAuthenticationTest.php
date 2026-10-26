<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_guests_are_redirected_and_normal_users_cannot_manage_content(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->post('/admin/content/team', [])->assertRedirect('/admin/login');
        $this->postJson('/admin/media', [])->assertUnauthorized();
        $this->actingAs(User::factory()->create())->put('/admin/settings', [])->assertForbidden();
        $this->postJson('/admin/media', [])->assertForbidden();
    }

    public function test_only_administrators_can_sign_in_and_logout_revokes_the_session(): void
    {
        $normal = User::factory()->create(['password' => 'a-long-test-password']);
        $this->post('/admin/login', ['email' => $normal->email, 'password' => 'a-long-test-password'])->assertSessionHasErrors('email');
        $this->assertGuest();
        $admin = User::factory()->create(['is_admin' => true, 'password' => 'another-test-password']);
        $this->post('/admin/login', ['email' => strtoupper($admin->email), 'password' => 'another-test-password'])->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin);
        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->assertGuest();
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_repeated_failed_credentials_are_rate_limited(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->post('/admin/login', ['email' => $user->email, 'password' => 'wrong-password'])->assertSessionHasErrors(['email' => 'These administrator credentials do not match our records.']);
        }
        $this->post('/admin/login', ['email' => $user->email, 'password' => 'wrong-password'])->assertSessionHasErrors('email');
        $this->assertStringContainsString('Too many attempts.', session('errors')->first('email'));
    }

    public function test_administrator_creation_hashes_the_password_and_does_not_grant_mass_assignment_access(): void
    {
        $this->artisan('admin:create', ['email' => 'owner@example.test', '--name' => 'Studio owner'])
            ->expectsQuestion('Password (at least 12 characters)', 'a-secure-test-password')
            ->expectsQuestion('Confirm password', 'a-secure-test-password')
            ->assertSuccessful();
        $user = User::query()->where('email', 'owner@example.test')->firstOrFail();
        $this->assertTrue($user->is_admin);
        $this->assertTrue(Hash::check('a-secure-test-password', $user->password));
        $this->assertNotContains('is_admin', $user->getFillable());
    }

    public function test_existing_accounts_are_not_promoted_or_reset_without_confirmation(): void
    {
        $user = User::factory()->create(['email' => 'existing@example.test']);
        $originalPassword = $user->password;
        $this->artisan('admin:create', ['email' => $user->email, '--name' => 'Existing person'])
            ->expectsConfirmation('This account exists. Grant admin access and replace its password?', false)
            ->assertFailed();
        $this->assertFalse($user->refresh()->is_admin);
        $this->assertSame($originalPassword, $user->password);
    }
}
