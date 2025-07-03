import React from "react";

interface TwoColContent {
    image: string;
    alt?: string;
    heading: string;
    body: string;
    button: {
        text: string;
        backgroundColor: string;
        textColor: string;
    };
    layout?: "image_right" | "image_left";
}

const SectionPreviewTwoCol: React.FC<{ content: TwoColContent }> = ({ content }) => {
    const imageEl = (
        <img
            src={content.image}
            alt={content.alt}
            style={{ width: "100%", maxWidth: 280, borderRadius: 4 }}
        />
    );
    const textEl = (
        <div style={{ padding: "0 16px" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{content.heading}</h3>
            <p style={{ margin: "0 0 12px 0" }}>{content.body}</p>
            <button
                style={{
                    background: content.button.backgroundColor,
                    color: content.button.textColor,
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 4,
                    cursor: "pointer",
                }}
            >
                {content.button.text}
            </button>
        </div>
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: content.layout === "image_right" ? "row-reverse" : "row",
                alignItems: "center",
                padding: 16,
                gap: 16,
            }}
        >
            {imageEl}
            {textEl}
        </div>
    );
};

export default SectionPreviewTwoCol;

