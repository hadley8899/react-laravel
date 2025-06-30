@php
    $tag = $content['listType'] === 'number' ? 'ol' : 'ul';
@endphp

<mj-section padding="0px">
    <mj-column>
        <mj-text padding="16px">
            <<?= $tag ?> style="margin:0;padding-left:20px;">
            @foreach($content['items'] as $item)
                <li style="margin-bottom:4px;">{{ $item }}</li>
            @endforeach
        </<?= $tag ?>>
        </mj-text>
    </mj-column>
</mj-section>
