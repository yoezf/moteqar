<x-filament-widgets::widget>
    <div class="mq-cards">
        @forelse ($projects as $p)
            <a href="{{ $url($p) }}" class="mq-card">
                <div class="mq-card-top">
                    <div><div class="mq-card-title">{{ $p->title }}</div><div class="mq-card-sub">{{ $p->serviceLabel() ?: 'Proyek' }}@if($p->deadline) · Tenggat {{ $p->deadline->translatedFormat('d M Y') }}@endif</div></div>
                    <div class="mq-pct">{{ $p->progress() }}%</div>
                </div>
                <div class="mq-bar"><i style="width: {{ $p->progress() }}%"></i></div>
                @include('filament.portal.stepper', ['status' => $p->status])
            </a>
        @empty
            <div class="mq-empty">Belum ada proyek. Tim MOTEQAR akan menambahkannya setelah kesepakatan.</div>
        @endforelse
    </div>
</x-filament-widgets::widget>
