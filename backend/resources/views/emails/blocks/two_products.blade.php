<mj-section padding="0px">
    @foreach ($content['products'] as $product)
        <mj-column width="{{ 100 / count($content['products']) }}%">
            <mj-image
                src="{{ $product['image'] }}"
                alt="{{ $product['title'] }}"
                padding="0px"
            ></mj-image>

            <mj-text
                padding-top="12px"
                font-size="16px"
                font-weight="bold"
                align="center"
            >
                {{ $product['title'] }}
            </mj-text>

            <mj-text
                font-size="14px"
                padding-top="0px"
                align="center"
            >
                {{ $product['desc'] }}
            </mj-text>

            <mj-text
                font-size="14px"
                font-weight="bold"
                padding-top="8px"
                align="center"
            >
                {{ $product['price'] }}
            </mj-text>
        </mj-column>
    @endforeach
</mj-section>
