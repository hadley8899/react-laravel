<mj-section padding="0px">
    @foreach ($content['columns'] as $column)
        <mj-column width="{{ 100 / count($content['columns']) }}%">
            <mj-text
                font-size="16px"
                line-height="1.6"
                padding="16px"
            >
                {{ $column['text'] }}
            </mj-text>
        </mj-column>
    @endforeach
</mj-section>
