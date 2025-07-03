<mj-section padding="0px">
    <mj-column>
        <mj-image
            src="{{ $content['left']['image'] }}"
            alt=""
            padding="16px"
        ></mj-image>
    </mj-column>

    <mj-column>
        <mj-text
            padding="16px"
            font-size="16px"
            line-height="1.6"
        >
            {{ $content['right']['text'] }}
        </mj-text>
    </mj-column>
</mj-section>
