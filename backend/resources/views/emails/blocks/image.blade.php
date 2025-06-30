<mj-section padding="0px">
    <mj-column>
        <mj-image
            src="{{ $content['src'] }}"
            alt="{{ $content['alt'] }}"
            width="{{ $content['width'] }}"
            padding="16px"
        ></mj-image>

        @if(!empty($content['caption']))
            <mj-text
                font-size="13px"
                color="#666666"
                font-style="italic"
                padding-top="0px"
                padding-bottom="16px"
                align="center"
            >
                {{ $content['caption'] }}
            </mj-text>
        @endif
    </mj-column>
</mj-section>
