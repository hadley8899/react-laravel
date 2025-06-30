<mj-section background-color="{{ $content['backgroundColor'] }}" padding="0px">
    <mj-column>
        <mj-text
            font-size="14px"
            color="{{ $content['textColor'] }}"
            align="center"
            padding="16px"
            line-height="1.4"
        >
            <strong>{{ $content['companyName'] }}</strong><br>
            {{ $content['address'] }}<br><br>
            <a href="*|UNSUB|*" style="color:{{ $content['textColor'] }};text-decoration:underline;">
                {{ $content['unsubscribeText'] }}
            </a>
        </mj-text>
    </mj-column>
</mj-section>
