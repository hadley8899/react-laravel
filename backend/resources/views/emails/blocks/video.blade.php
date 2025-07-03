<mj-section padding="0px">
    <mj-column>
        <!-- mj-raw so MJML doesn’t strip the iframe -->
        <mj-raw>
            <div style="text-align:center;">
                <iframe
                    src="{{ $content['url'] }}"
                    width="560"
                    height="315"
                    frameborder="0"
                    allowfullscreen
                    style="max-width:100%; border:none; border-radius:4px;"
                ></iframe>
            </div>
        </mj-raw>

        @if (!empty($content['caption']))
            <mj-text
                font-size="13px"
                color="#666666"
                align="center"
                padding-top="8px"
            >
                {{ $content['caption'] }}
            </mj-text>
        @endif
    </mj-column>
</mj-section>
