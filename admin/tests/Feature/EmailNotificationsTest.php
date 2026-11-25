<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Payment;
use App\Models\Project;
use App\Models\User;
use App\Notifications\InvoiceNotice;
use App\Notifications\LeadReceipt;
use App\Notifications\NewLead;
use App\Notifications\ProjectStageChanged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmailNotificationsTest extends TestCase
{
    use RefreshDatabase;

    private function setUpProject(): array
    {
        $c = Client::create(['name' => 'C', 'email' => 'c@x.id']);
        $client = User::factory()->create(['email' => 'c@x.id', 'role' => 'client', 'client_id' => $c->id]);
        $p = Project::create(['client_id' => $c->id, 'title' => 'P', 'agreed_price' => 1000]);

        return [$client, $p];
    }

    public function test_landing_lead_notifies_admins_and_sends_receipt_to_visitor(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->postJson('/api/leads', ['name' => 'Budi', 'email' => 'budi@x.id', 'service' => 'website', 'details' => 'Butuh website toko'])->assertCreated();

        Notification::assertSentTo($admin, NewLead::class);
        Notification::assertSentOnDemand(LeadReceipt::class, fn ($n, $channels, $notifiable) => $notifiable->routes['mail'] === 'budi@x.id');
    }

    public function test_stage_change_emails_the_client_only_when_status_changes(): void
    {
        [$client, $p] = $this->setUpProject();
        Notification::fake();

        $p->update(['title' => 'P2']);
        Notification::assertNothingSent();

        $p->update(['status' => 'development']);
        Notification::assertSentTo($client, ProjectStageChanged::class);
    }

    public function test_invoice_created_and_paid_emails(): void
    {
        [$client, $p] = $this->setUpProject();
        Notification::fake();

        $pay = $p->payments()->create(['title' => 'DP', 'amount' => 500, 'status' => 'unpaid']);
        Notification::assertSentTo($client, InvoiceNotice::class, fn ($n) => $n->kind === 'new');

        $pay->update(['status' => 'paid']);
        Notification::assertSentTo($client, InvoiceNotice::class, fn ($n) => $n->kind === 'paid');
    }

    public function test_reminder_command_sends_once_a_week(): void
    {
        [$client, $p] = $this->setUpProject();
        $p->payments()->create(['title' => 'Late', 'amount' => 500, 'status' => 'unpaid', 'due_date' => today()->subDay()]);
        $p->payments()->create(['title' => 'Far', 'amount' => 500, 'status' => 'unpaid', 'due_date' => today()->addDays(20)]);
        Notification::fake();

        $this->artisan('moteqar:remind-payments')->expectsOutput('1 pengingat dikirim.')->assertSuccessful();
        Notification::assertSentToTimes($client, InvoiceNotice::class, 1);

        $this->artisan('moteqar:remind-payments')->expectsOutput('0 pengingat dikirim.');
    }
}
