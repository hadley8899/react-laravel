<mj-section padding="0px">
    <mj-column>
        <mj-social
            align="center"
            icon-size="{{ $content['iconSize'] }}"
            color="{{ $content['iconColor'] }}"
            font-size="13px"
            mode="horizontal"
            padding="16px"
        >
            @if(!empty($content['facebook']))
                <mj-social-element name="facebook" href="{{ $content['facebook'] }}"></mj-social-element>
            @endif
            @if(!empty($content['instagram']))
                <mj-social-element name="instagram" href="{{ $content['instagram'] }}"></mj-social-element>
            @endif
            @if(!empty($content['x']))
                <mj-social-element name="twitter" href="{{ $content['x'] }}"></mj-social-element>
            @endif
            @if(!empty($content['linkedin']))
                <mj-social-element name="linkedin" href="{{ $content['linkedin'] }}"></mj-social-element>
            @endif
        </mj-social>
    </mj-column>
</mj-section>
