@php($align = $content['alignment'] ?? 'center')

<mj-section padding="0px">
    <mj-column>
        @foreach ($content['buttons'] as $btn)
            <mj-button
                align="{{ $align }}"
                background-color="{{ $btn['backgroundColor'] }}"
                color="{{ $btn['textColor'] }}"
                href="{{ $btn['url'] }}"
                padding="8px 16px"
                font-size="16px"
                border-radius="4px"
            >
                {{ $btn['text'] }}
            </mj-button>
        @endforeach
    </mj-column>
</mj-section>
