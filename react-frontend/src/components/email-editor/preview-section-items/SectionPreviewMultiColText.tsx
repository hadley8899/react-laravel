import React from "react";

interface MultiColTextContent {
    columns: { text: string }[];
}

const SectionPreviewMultiColText: React.FC<{ content: MultiColTextContent }> = ({ content }) => (
    <div
        style={{
            display: "flex",
            gap: 16,
            padding: 16,
            flexDirection: "row",
        }}
    >
        {content.columns.map((c, idx) => (
            <p
                key={idx}
                style={{
                    flex: 1,
                    margin: 0,
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                }}
            >
                {c.text}
            </p>
        ))}
    </div>
);

export default SectionPreviewMultiColText;

