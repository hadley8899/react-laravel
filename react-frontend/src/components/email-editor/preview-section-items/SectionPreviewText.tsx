import React from "react";

interface TextContent {
    fontSize: string;
    textAlign: string;
    text: string;
}

const SectionPreviewText: React.FC<{ content: TextContent }> = ({ content }) => (
    <div style={{ padding: "16px" }}>
        <p
            style={{
                fontSize: content.fontSize,
                textAlign: content.textAlign as React.CSSProperties["textAlign"],
                margin: 0,
                lineHeight: 1.6,
            }}
        >
            {content.text}
        </p>
    </div>
);

export default SectionPreviewText;
