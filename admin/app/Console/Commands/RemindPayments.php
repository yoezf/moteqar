<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Notifications\InvoiceNotice;
use Illuminate\Console\Command;

// Daily: remind clients about unpaid invoices due within 3 days or already overdue, at most once a week per invoice.
class RemindPayments extends Command
{
    protected $signature = 'moteqar:remind-payments';

    protected $description = 'Kirim pengingat tagihan yang akan jatuh tempo atau sudah lewat';

    public function handle(): int
    {
        $sent = 0;
        Payment::with('project.client.users')->where('status', 'unpaid')
            ->whereNotNull('due_date')->whereDate('due_date', '<=', today()->addDays(3))
            ->where(fn ($q) => $q->whereNull('reminded_at')->orWhereDate('reminded_at', '<=', today()->subDays(7)))
            ->get()->each(function (Payment $pay) use (&$sent) {
                try {
                    \Illuminate\Support\Facades\Notification::send($pay->project->client->users, new InvoiceNotice($pay, 'due'));
                    $pay->forceFill(['reminded_at' => today()])->saveQuietly();
                    $sent++;
                } catch (\Throwable $e) {
                    report($e);
                }
            });
        $this->info("$sent pengingat dikirim.");

        return self::SUCCESS;
    }
}
