@php
    $steps = ['consultation' => 'Konsultasi', 'quotation' => 'Penawaran', 'development' => 'Pengerjaan', 'revision' => 'Revisi', 'done' => 'Selesai'];
    $keys = array_keys($steps);
    $cur = array_search($status, $keys, true);
@endphp
@if ($status === 'cancelled')
    <span class="mq-badge-off">Dibatalkan</span>
@else
    <ol class="mq-steps">
        @foreach ($steps as $k => $label)
            <li class="{{ $loop->index < $cur || $status === 'done' ? 'is-done' : ($loop->index === $cur ? 'is-now' : '') }}">
                <span class="mq-dot">{{ $loop->iteration }}</span><span class="mq-lbl">{{ $label }}</span>
            </li>
        @endforeach
    </ol>
@endif
