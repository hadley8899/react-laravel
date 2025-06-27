import { SECTION_TYPES } from "../../mock/editor/default-sections";

export const renderEditForm = (editingSection, updateContent) => {
    if (!editingSection) return null;

    const { type, content } = editingSection;

    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        marginBottom: '12px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '4px',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    switch (type) {
        case SECTION_TYPES.HEADER:
            return (
                <div>
                    <label style={labelStyle}>Heading</label>
                    <input
                        style={inputStyle}
                        value={content.heading}
                        onChange={(e) => updateContent('heading', e.target.value)}
                    />

                    <label style={labelStyle}>Subheading</label>
                    <input
                        style={inputStyle}
                        value={content.subheading}
                        onChange={(e) => updateContent('subheading', e.target.value)}
                    />

                    <label style={labelStyle}>Background Color</label>
                    <input
                        type="color"
                        style={inputStyle}
                        value={content.backgroundColor}
                        onChange={(e) => updateContent('backgroundColor', e.target.value)}
                    />

                    <label style={labelStyle}>Text Color</label>
                    <input
                        type="color"
                        style={inputStyle}
                        value={content.textColor}
                        onChange={(e) => updateContent('textColor', e.target.value)}
                    />
                </div>
            );

        case SECTION_TYPES.TEXT:
            return (
                <div>
                    <label style={labelStyle}>Text Content</label>
                    <textarea
                        style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
                        value={content.text}
                        onChange={(e) => updateContent('text', e.target.value)}
                    />

                    <label style={labelStyle}>Font Size</label>
                    <input
                        style={inputStyle}
                        value={content.fontSize}
                        onChange={(e) => updateContent('fontSize', e.target.value)}
                    />

                    <label style={labelStyle}>Text Alignment</label>
                    <select
                        style={inputStyle}
                        value={content.textAlign}
                        onChange={(e) => updateContent('textAlign', e.target.value)}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            );

        case SECTION_TYPES.IMAGE:
            return (
                <div>
                    <label style={labelStyle}>Image URL</label>
                    <input
                        style={inputStyle}
                        value={content.src}
                        onChange={(e) => updateContent('src', e.target.value)}
                    />

                    <label style={labelStyle}>Alt Text</label>
                    <input
                        style={inputStyle}
                        value={content.alt}
                        onChange={(e) => updateContent('alt', e.target.value)}
                    />

                    <label style={labelStyle}>Width</label>
                    <input
                        style={inputStyle}
                        value={content.width}
                        onChange={(e) => updateContent('width', e.target.value)}
                    />

                    <label style={labelStyle}>Caption</label>
                    <input
                        style={inputStyle}
                        value={content.caption}
                        onChange={(e) => updateContent('caption', e.target.value)}
                    />
                </div>
            );

        case SECTION_TYPES.BUTTON:
            return (
                <div>
                    <label style={labelStyle}>Button Text</label>
                    <input
                        style={inputStyle}
                        value={content.text}
                        onChange={(e) => updateContent('text', e.target.value)}
                    />

                    <label style={labelStyle}>URL</label>
                    <input
                        style={inputStyle}
                        value={content.url}
                        onChange={(e) => updateContent('url', e.target.value)}
                    />

                    <label style={labelStyle}>Background Color</label>
                    <input
                        type="color"
                        style={inputStyle}
                        value={content.backgroundColor}
                        onChange={(e) => updateContent('backgroundColor', e.target.value)}
                    />

                    <label style={labelStyle}>Text Color</label>
                    <input
                        type="color"
                        style={inputStyle}
                        value={content.textColor}
                        onChange={(e) => updateContent('textColor', e.target.value)}
                    />

                    <label style={labelStyle}>Alignment</label>
                    <select
                        style={inputStyle}
                        value={content.alignment}
                        onChange={(e) => updateContent('alignment', e.target.value)}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            );

        case SECTION_TYPES.LIST:
            return (
                <div>
                    <label style={labelStyle}>List Type</label>
                    <select
                        style={inputStyle}
                        value={content.listType}
                        onChange={(e) => updateContent('listType', e.target.value)}
                    >
                        <option value="bullet">Bullet Points</option>
                        <option value="number">Numbered</option>
                    </select>

                    <label style={labelStyle}>List Items (one per line)</label>
                    <textarea
                        style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
                        value={content.items.join('\n')}
                        onChange={(e) => updateContent('items', e.target.value.split('\n').filter(item => item.trim()))}
                    />
                </div>
            );

        case SECTION_TYPES.FOOTER:
            return (
                <div>
                    <label style={labelStyle}>Company Name</label>
                    <input
                        style={inputStyle}
                        value={content.companyName}
                        onChange={(e) => updateContent('companyName', e.target.value)}
                    />

                    <label style={labelStyle}>Address</label>
                    <input
                        style={inputStyle}
                        value={content.address}
                        onChange={(e) => updateContent('address', e.target.value)}
                    />

                    <label style={labelStyle}>Unsubscribe Text</label>
                    <input
                        style={inputStyle}
                        value={content.unsubscribeText}
                        onChange={(e) => updateContent('unsubscribeText', e.target.value)}
                    />

                    <label style={labelStyle}>Background Color</label>
                    <input
                        type="color"
                        style={inputStyle}
                        value={content.backgroundColor}
                        onChange={(e) => updateContent('backgroundColor', e.target.value)}
                    />

                    <label style={labelStyle}>Text Color</label>
                    <input
                        type="color"
                        style={inputStyle}
                        value={content.textColor}
                        onChange={(e) => updateContent('textColor', e.target.value)}
                    />
                </div>
            );

        default:
            return <div>No edit form available</div>;
    }
};