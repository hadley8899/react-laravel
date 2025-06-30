<mj-section padding="0px">
    <mj-column>
        <mj-button
            href="{{ $content['url'] }}"
            background-color="{{ $content['backgroundColor'] }}"
            color="{{ $content['textColor'] }}"
            inner-padding="12px 24px"
            font-size="16px"
            align="{{ $content['alignment'] }}"
            border-radius="4px"
        >
            {{ $content['text'] }}
        </mj-button>
    </mj-column>
</mj-section>
