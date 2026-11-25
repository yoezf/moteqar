<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectFilesTest extends TestCase
{
    use RefreshDatabase;

    private function fileFor(Client $c): ProjectFile
    {
        Storage::fake('local');
        Storage::disk('local')->put('project-files/shared/a.txt', 'hello');
        $p = Project::create(['client_id' => $c->id, 'title' => 'P']);

        return ProjectFile::create(['project_id' => $p->id, 'name' => 'a.txt', 'path' => 'project-files/shared/a.txt', 'size' => 5, 'from_client' => true]);
    }

    private function clientUser(string $email): array
    {
        $c = Client::create(['name' => $email, 'email' => $email]);

        return [$c, User::factory()->create(['email' => $email, 'role' => 'client', 'client_id' => $c->id])];
    }

    public function test_only_owner_client_and_admin_can_download(): void
    {
        [$c1, $u1] = $this->clientUser('one@x.id');
        [, $u2] = $this->clientUser('two@x.id');
        $admin = User::factory()->create(['role' => 'admin']);
        $f = $this->fileFor($c1);

        $this->get("/files/{$f->id}")->assertForbidden();
        $this->actingAs($u2)->get("/files/{$f->id}")->assertForbidden();
        $this->actingAs($u1)->get("/files/{$f->id}")->assertOk();
        $this->actingAs($admin)->get("/files/{$f->id}")->assertOk();
    }

    public function test_client_upload_notifies_admins(): void
    {
        [$c1] = $this->clientUser('one@x.id');
        $admin = User::factory()->create(['role' => 'admin']);
        $this->fileFor($c1);

        $this->assertSame(1, $admin->notifications()->count());
    }

    public function test_admin_project_page_and_relation_managers_render(): void
    {
        [$c] = $this->clientUser('one@x.id');
        $f = $this->fileFor($c);
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->saveAppAuthenticationSecret('JBSWY3DPEHPK3PXP'); // 2FA is required for admins

        $this->actingAs($admin)->get("/admin/projects/{$f->project_id}/edit")->assertOk();
        \Livewire\Livewire::actingAs($admin)->test(\App\Filament\Shared\FilesRelationManager::class, ['ownerRecord' => $f->project, 'pageClass' => \App\Filament\Resources\Projects\Pages\EditProject::class])->assertSee('a.txt');
        \Livewire\Livewire::actingAs($admin)->test(\App\Filament\Resources\Projects\RelationManagers\PaymentsRelationManager::class, ['ownerRecord' => $f->project, 'pageClass' => \App\Filament\Resources\Projects\Pages\EditProject::class])->assertOk();
    }
}
