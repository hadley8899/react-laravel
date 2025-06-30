<mj-section background-color="{{ $content['backgroundColor'] }}">
    <mj-column>
        <mj-text
            font-size="22px"
            font-weight="bold"
            color="{{ $content['textColor'] }}"
            align="center"
            padding="0px"
        >
            {{ $content['heading'] }}
        </mj-text>

        @if(!empty($content['subheading']))
            <mj-text
                padding-top="8px"
                font-size="16px"
                color="{{ $content['textColor'] }}"
                align="center"
            >
                {{ $content['subheading'] }}
            </mj-text>
        @endif
    </mj-column>
</mj-section>
