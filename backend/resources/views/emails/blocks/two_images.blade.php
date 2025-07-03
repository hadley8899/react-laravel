<mj-section padding="0px">
    @foreach ($content['images'] as $img)
        <mj-column width="{{ 100 / count($content['images']) }}%">
            <mj-image
                src="{{ $img['src'] }}"
                alt="{{ $img['alt'] }}"
                padding="16px"
            ></mj-image>
        </mj-column>
    @endforeach
</mj-section>
