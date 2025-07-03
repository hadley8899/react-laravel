import React from "react";

interface MultiButtonsContent {
    buttons: {
        text: string;
        backgroundColor: string;
        textColor: string;
    }[];
    alignment?: string;
}

const SectionPreviewMultiButtons: React.FC<{ content: MultiButtonsContent }> = ({ content }) => (
    <div
        style={{
            padding: "16px",
            textAlign: content.alignment as React.CSSProperties["textAlign"],
        }}
    >
        {content.buttons?.map((b, i) => (
            <button
                key={i}
                style={{
                    backgroundColor: b.backgroundColor,
                    color: b.textColor,
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    margin: "0 6px 6px 0",
                    textDecoration: "none",
                    display: "inline-block",
                }}
            >
                {b.text}
            </button>
        ))}
    </div>
);

export default SectionPreviewMultiButtons;

