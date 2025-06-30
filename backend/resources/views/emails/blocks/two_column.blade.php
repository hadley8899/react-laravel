@php
    $imageFirst = $content['layout'] !== 'image_right';
@endphp

<mj-section padding="0px">
    @if($imageFirst)
        <mj-column width="50%">
            <mj-image src="{{ $content['image'] }}" alt="{{ $content['alt'] }}" />
        </mj-column>
    @endif

    <mj-column width="50%">
        <mj-text font-size="18px" font-weight="bold" padding-bottom="8px">
            {{ $content['heading'] }}
        </mj-text>
        <mj-text padding-top="0px" padding-bottom="16px">
            {{ $content['body'] }}
        </mj-text>
        <mj-button
            background-color="{{ $content['button']['backgroundColor'] }}"
            color="{{ $content['button']['textColor'] }}"
            href="{{ $content['button']['url'] }}"
            border-radius="4px"
            inner-padding="10px 24px"
        >
            {{ $content['button']['text'] }}
        </mj-button>
    </mj-column>

    @unless($imageFirst)
        <mj-column width="50%">
            <mj-image src="{{ $content['image'] }}" alt="{{ $content['alt'] }}" />
        </mj-column>
    @endunless
</mj-section>
