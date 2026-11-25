@include('filament.portal.stepper', ['status' => $getRecord()->status])
<div class="mq-bar" style="margin-top:1rem"><i style="width: {{ $getRecord()->progress() }}%"></i></div>
<div class="mq-card-sub" style="margin-top:.4rem">{{ $getRecord()->progress() }}% selesai</div>
