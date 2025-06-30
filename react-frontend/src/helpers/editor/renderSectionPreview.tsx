import React from 'react';

/**
 * Lightweight visual for the drag-and-drop canvas.
 * Keep styling inline so we don’t pull extra CSS.
 */
export const renderSectionPreview: React.FC = (section: any) => {
    const { type, content } = section;

    switch (type) {
        /* ───────────────────────────────── HEADER ────────────────────────── */
        case 'header':
            return (
                <div
                    style={{
                        backgroundColor: content.backgroundColor,
                        color: content.textColor,
                        padding: '24px',
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>{content.heading}</h2>
                    <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>{content.subheading}</p>
                </div>
            );

        /* ───────────────────────────────── TEXT ───────────────────────────── */
        case 'text':
            return (
                <div style={{ padding: '16px' }}>
                    <p
                        style={{
                            fontSize: content.fontSize,
                            textAlign: content.textAlign,
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        {content.text}
                    </p>
                </div>
            );

        /* ───────────────────────────────── IMAGE ──────────────────────────── */
        case 'image':
            return (
                <div style={{ padding: '16px', textAlign: 'center' }}>
                    <img
                        src={content.src}
                        alt={content.alt}
                        style={{ width: content.width, maxWidth: '100%', height: 'auto' }}
                    />
                    {content.caption && (
                        <p
                            style={{
                                margin: '8px 0 0 0',
                                fontSize: '0.875rem',
                                color: '#666',
                                fontStyle: 'italic',
                            }}
                        >
                            {content.caption}
                        </p>
                    )}
                </div>
            );

        /* ───────────────────────────────── BUTTON ─────────────────────────── */
        case 'button':
            return (
                <div style={{ padding: '16px', textAlign: content.alignment }}>
                    <button
                        style={{
                            backgroundColor: content.backgroundColor,
                            color: content.textColor,
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        {content.text}
                    </button>
                </div>
            );

        /* ───────────────────────────────── LIST ───────────────────────────── */
        case 'list':
            return (
                <div style={{ padding: '16px' }}>
                    {content.listType === 'bullet' ? (
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {content.items.map((item: string, i: number) => (
                                <li key={i} style={{ marginBottom: 4 }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ol style={{ margin: 0, paddingLeft: '20px' }}>
                            {content.items.map((item: string, i: number) => (
                                <li key={i} style={{ marginBottom: 4 }}>
                                    {item}
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            );

        /* ───────────────────────────────── FOOTER ─────────────────────────── */
        case 'footer':
            return (
                <div
                    style={{
                        backgroundColor: content.backgroundColor,
                        color: content.textColor,
                        padding: '16px',
                        textAlign: 'center',
                        fontSize: 14,
                    }}
                >
                    <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>{content.companyName}</p>
                    <p style={{ margin: '0 0 8px 0' }}>{content.address}</p>
                    <p style={{ margin: 0, textDecoration: 'underline' }}>{content.unsubscribeText}</p>
                </div>
            );

        /* ──────────────────────────────── NEW BLOCKS ──────────────────────── */
        case 'divider':
            return <hr style={{ height: content.height, background: content.color, border: 'none' }} />;

        case 'spacer':
            return <div style={{ height: content.height }} />;

        case 'quote':
            return (
                <blockquote
                    style={{
                        margin: 0,
                        padding: '24px',
                        background: content.backgroundColor,
                        color: content.textColor,
                        fontStyle: 'italic',
                    }}
                >
                    <p style={{ margin: 0 }}>{content.text}</p>
                    <footer style={{ marginTop: 8, fontWeight: 700 }}>— {content.author}</footer>
                </blockquote>
            );

        case 'two_column': {
            const imageEl = (
                <img
                    src={content.image}
                    alt={content.alt}
                    style={{ width: '100%', maxWidth: 280, borderRadius: 4 }}
                />
            );
            const textEl = (
                <div style={{ padding: '0 16px' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>{content.heading}</h3>
                    <p style={{ margin: '0 0 12px 0' }}>{content.body}</p>
                    <button
                        style={{
                            background: content.button.backgroundColor,
                            color: content.button.textColor,
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: 4,
                            cursor: 'pointer',
                        }}
                    >
                        {content.button.text}
                    </button>
                </div>
            );

            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: content.layout === 'image_right' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        padding: 16,
                        gap: 16,
                    }}
                >
                    {imageEl}
                    {textEl}
                </div>
            );
        }

        case 'social': {
            const size = parseInt(content.iconSize, 10) || 24;
            const links = [
                { key: 'facebook', label: 'F' },
                { key: 'instagram', label: 'I' },
                { key: 'x', label: 'X' },
                { key: 'linkedin', label: 'L' },
            ].filter(l => content[l.key]);
            return (
                <div style={{ padding: 16, textAlign: 'center' }}>
                    {links.map(l => (
                        <a
                            key={l.key}
                            href={content[l.key]}
                            style={{
                                display: 'inline-block',
                                width: size,
                                height: size,
                                lineHeight: `${size}px`,
                                margin: '0 6px',
                                borderRadius: '50%',
                                background: content.iconColor,
                                color: '#fff',
                                fontWeight: 700,
                                textDecoration: 'none',
                                fontSize: size * 0.55,
                            }}
                        >
                            {l.label}ß
                        </a>
                    ))}
                </div>
            );
        }

        /* ───────────────────────────────── FALLBACK ───────────────────────── */
        default:
            return <div style={{ padding: 16, color: '#999' }}>Unknown section type</div>;
    }
};
