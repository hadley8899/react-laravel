<mj-section background-color="{{ $content['backgroundColor'] }}" padding="0px">
    <mj-column>
        <mj-text
            font-style="italic"
            color="{{ $content['textColor'] }}"
            padding="24px"
            line-height="1.5"
            font-size="16px"
        >
            {{ $content['text'] }}<br><br>
            <span style="font-style:normal;font-weight:bold;">— {{ $content['author'] }}</span>
        </mj-text>
    </mj-column>
</mj-section>
