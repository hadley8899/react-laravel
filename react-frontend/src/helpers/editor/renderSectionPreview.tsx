import {SECTION_TYPES} from "../../mock/editor/default-sections.ts";

export const renderSectionPreview = (section) => {
    const { type, content } = section;

    switch (type) {
        case SECTION_TYPES.HEADER:
            return (
                <div style={{
            backgroundColor: content.backgroundColor,
                color: content.textColor,
                padding: '24px',
                textAlign: 'center'
        }}>
    <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>{content.heading}</h2>
    <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>{content.subheading}</p>
    </div>
);

case SECTION_TYPES.TEXT:
    return (
        <div style={{ padding: '16px' }}>
    <p style={{
        fontSize: content.fontSize,
            textAlign: content.textAlign,
            margin: 0,
            lineHeight: 1.6
    }}>
    {content.text}
    </p>
    </div>
);

case SECTION_TYPES.IMAGE:
    return (
        <div style={{ padding: '16px', textAlign: 'center' }}>
    <img
        src={content.src}
    alt={content.alt}
    style={{ width: content.width, maxWidth: '100%', height: 'auto' }}
    />
    {content.caption && (
        <p style={{
        margin: '8px 0 0 0',
            fontSize: '0.875rem',
            color: '#666',
            fontStyle: 'italic'
    }}>
        {content.caption}
        </p>
    )}
    </div>
);

case SECTION_TYPES.BUTTON:
    return (
        <div style={{ padding: '16px', textAlign: content.alignment }}>
    <button style={{
        backgroundColor: content.backgroundColor,
            color: content.textColor,
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
    }}>
    {content.text}
    </button>
    </div>
);

case SECTION_TYPES.LIST:
    return (
        <div style={{ padding: '16px' }}>
    {content.listType === 'bullet' ? (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {content.items.map((item, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>
            {item}
            </li>
        ))}
        </ul>
    ) : (
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
        {content.items.map((item, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>
            {item}
            </li>
        ))}
        </ol>
    )}
    </div>
);

case SECTION_TYPES.FOOTER:
    return (
        <div style={{
        backgroundColor: content.backgroundColor,
            color: content.textColor,
            padding: '16px',
            textAlign: 'center',
            fontSize: '14px'
    }}>
    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{content.companyName}</p>
    <p style={{ margin: '0 0 8px 0' }}>{content.address}</p>
    <p style={{
        margin: 0,
            textDecoration: 'underline',
            cursor: 'pointer'
    }}>
    {content.unsubscribeText}
    </p>
    </div>
);

default:
    return <div>Unknown section type</div>;
}
};