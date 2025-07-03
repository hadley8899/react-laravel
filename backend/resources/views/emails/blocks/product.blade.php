<mj-section padding="0px">
    <mj-column width="100%">
        <mj-image
            src="{{ $content['image'] }}"
            alt="{{ $content['title'] }}"
            padding="0px"
        ></mj-image>

        <mj-text
            padding-top="12px"
            font-size="18px"
            font-weight="bold"
            align="center"
        >
            {{ $content['title'] }}
        </mj-text>

        <mj-text
            font-size="14px"
            padding-top="0px"
            align="center"
        >
            {{ $content['desc'] }}
        </mj-text>

        <mj-text
            font-size="16px"
            font-weight="bold"
            padding-top="8px"
            align="center"
        >
            {{ $content['price'] }}
        </mj-text>

        <mj-button
            align="center"
            background-color="{{ $content['button']['backgroundColor'] }}"
            color="{{ $content['button']['textColor'] }}"
            href="{{ $content['button']['url'] }}"
            padding="12px 24px"
            font-size="16px"
            border-radius="4px"
        >
            {{ $content['button']['text'] }}
        </mj-button>
    </mj-column>
</mj-section>
