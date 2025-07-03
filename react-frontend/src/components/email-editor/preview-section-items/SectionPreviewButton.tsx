import React from "react";

interface ButtonContent {
    text: string;
    backgroundColor: string;
    textColor: string;
    alignment?: string;
}

const SectionPreviewButton: React.FC<{ content: ButtonContent }> = ({ content }) => (
    <div
        style={{
            padding: "16px",
            textAlign: content.alignment as React.CSSProperties["textAlign"],
        }}
    >
        <button
            style={{
                backgroundColor: content.backgroundColor,
                color: content.textColor,
                border: "none",
                padding: "12px 24px",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
            }}
        >
            {content.text}
        </button>
    </div>
);

export default SectionPreviewButton;
