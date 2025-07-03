import React from "react";

interface QuoteContent {
    backgroundColor: string;
    textColor: string;
    text: string;
    author: string;
}

const SectionPreviewQuote: React.FC<{ content: QuoteContent }> = ({ content }) => (
    <blockquote
        style={{
            margin: 0,
            padding: "24px",
            background: content.backgroundColor,
            color: content.textColor,
            fontStyle: "italic",
        }}
    >
        <p style={{ margin: 0 }}>{content.text}</p>
        <footer style={{ marginTop: 8, fontWeight: 700 }}>
            — {content.author}
        </footer>
    </blockquote>
);

export default SectionPreviewQuote;

