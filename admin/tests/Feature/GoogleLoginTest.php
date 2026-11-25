<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as GoogleUser;
use Mockery;
use Tests\TestCase;

class GoogleLoginTest extends TestCase
{
    use RefreshDatabase;

    private function google(string $email, bool $verified = true): void
    {
        $gu = (new GoogleUser)->setRaw(['email_verified' => $verified])->map(['id' => '1', 'email' => $email, 'name' => 'X']);
        $gu->user = ['email_verified' => $verified];
        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('user')->andReturn($gu);
        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
    }

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.google.client_id' => 'id', 'services.google.client_secret' => 's']);
    }

    public function test_admin_lands_in_admin(): void
    {
        $admin = User::factory()->create(['email' => 'a@x.id', 'role' => 'admin']);
        $this->google('a@x.id');
        $this->get('/auth/google/callback')->assertRedirect(url('/admin'));
        $this->assertAuthenticatedAs($admin);

    }

    public function test_client_lands_in_portal(): void
    {
        $client = Client::create(['name' => 'C', 'email' => 'c@x.id']);
        $user = User::factory()->create(['email' => 'c@x.id', 'role' => 'client', 'client_id' => $client->id]);
        $this->google('c@x.id');
        $this->get('/auth/google/callback')->assertRedirect(url('/portal'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_unknown_or_unverified_email_is_refused(): void
    {
        User::factory()->create(['email' => 'a@x.id', 'role' => 'admin']);

        $this->google('nobody@x.id');
        $this->get('/auth/google/callback')->assertRedirect('/login')->assertSessionHas('google_error');
        $this->assertGuest();

        $this->google('a@x.id', verified: false);
        $this->get('/auth/google/callback')->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_route_is_hidden_when_google_is_not_configured(): void
    {
        config(['services.google.client_id' => null]);
        $this->get('/auth/google')->assertNotFound();
    }
}
