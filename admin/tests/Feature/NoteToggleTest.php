<?php

namespace Tests\Feature;

use App\Filament\Resources\Projects\Pages\EditProject;
use App\Filament\Resources\Projects\RelationManagers\NotesRelationManager;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Filament\Actions\Testing\TestAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class NoteToggleTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_toggle_is_saved_and_client_is_notified(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $c = Client::create(['name' => 'C', 'email' => 'c@x.id']);
        $client = User::factory()->create(['email' => 'c@x.id', 'role' => 'client', 'client_id' => $c->id]);
        $p = Project::create(['client_id' => $c->id, 'title' => 'P']);

        Livewire::actingAs($admin)->test(NotesRelationManager::class, ['ownerRecord' => $p, 'pageClass' => EditProject::class])
            ->callAction(TestAction::make('create')->table(), ['body' => 'Halo klien', 'is_public' => true])
            ->assertHasNoActionErrors();

        $this->assertTrue($p->notes()->first()->is_public);
        $this->assertSame(1, $client->notifications()->count());
    }
}
