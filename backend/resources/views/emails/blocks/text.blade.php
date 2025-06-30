<mj-section padding="0px">
    <mj-column>
        <mj-text
            font-size="{{ $content['fontSize'] }}"
            align="{{ $content['textAlign'] }}"
            line-height="1.6"
            padding="16px"
        >
            {!! nl2br(e($content['text'])) !!}
        </mj-text>
    </mj-column>
</mj-section>
