export const SECTION_TYPES = {
    HEADER: 'header',
    TEXT: 'text',
    IMAGE: 'image',
    BUTTON: 'button',
    LIST: 'list',
    FOOTER: 'footer'
};

export const DEFAULT_SECTIONS = {
    [SECTION_TYPES.HEADER]: {
        type: SECTION_TYPES.HEADER,
        title: 'Header Section',
        content: {
            heading: 'Welcome to Our Newsletter',
            subheading: 'Stay updated with our latest news',
            backgroundColor: '#1976d2',
            textColor: '#ffffff'
        }
    },
    [SECTION_TYPES.TEXT]: {
        type: SECTION_TYPES.TEXT,
        title: 'Text Section',
        content: {
            text: 'Add your text content here. You can include paragraphs, quotes, and formatted text.',
            fontSize: '16px',
            textAlign: 'left'
        }
    },
    [SECTION_TYPES.IMAGE]: {
        type: SECTION_TYPES.IMAGE,
        title: 'Image Section',
        content: {
            src: 'https://placehold.co/600x400?text=Hello+World',
            alt: 'Placeholder image',
            width: '100%',
            caption: ''
        }
    },
    [SECTION_TYPES.BUTTON]: {
        type: SECTION_TYPES.BUTTON,
        title: 'Button Section',
        content: {
            text: 'Call to Action',
            url: '#',
            backgroundColor: '#1976d2',
            textColor: '#ffffff',
            alignment: 'center'
        }
    },
    [SECTION_TYPES.LIST]: {
        type: SECTION_TYPES.LIST,
        title: 'List Section',
        content: {
            items: ['First item', 'Second item', 'Third item'],
            listType: 'bullet'
        }
    },
    [SECTION_TYPES.FOOTER]: {
        type: SECTION_TYPES.FOOTER,
        title: 'Footer Section',
        content: {
            companyName: 'Your Company',
            address: '123 Business St, City, State 12345',
            unsubscribeText: 'Unsubscribe from this list',
            backgroundColor: '#f5f5f5',
            textColor: '#666666'
        }
    }
};