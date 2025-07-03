@php($align = $content['alignment'] ?? 'center')

<mj-section padding="0px">
    <mj-group>
        @foreach ($content['buttons'] as $btn)
            <mj-column width="{{ 100 / count($content['buttons']) }}%">
                <mj-button
                    align="{{ $align }}"
                    background-color="{{ $btn['backgroundColor'] }}"
                    color="{{ $btn['textColor'] }}"
                    href="{{ $btn['url'] }}"
                    padding="8px 16px"
                    font-size="16px"
                    border-radius="4px"
                    width="100%"
                >
                    {{ $btn['text'] }}
                </mj-button>
            </mj-column>
        @endforeach
    </mj-group>
</mj-section>
