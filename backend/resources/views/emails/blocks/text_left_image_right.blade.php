<mj-section padding="0px">
    <mj-column>
        <mj-text
            padding="16px"
            font-size="16px"
            line-height="1.6"
        >
            {{ $content['left']['text'] }}
        </mj-text>
    </mj-column>

    <mj-column>
        <mj-image
            src="{{ $content['right']['image'] }}"
            alt=""
            padding="16px"
        ></mj-image>
    </mj-column>
</mj-section>
