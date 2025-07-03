import React from "react";

interface ImageContent {
    src: string;
    alt?: string;
    width?: string | number;
    caption?: string;
}

const SectionPreviewImage: React.FC<{ content: ImageContent }> = ({ content }) => (
    <div style={{ padding: "16px", textAlign: "center" }}>
        <img
            src={content.src}
            alt={content.alt}
            style={{ width: content.width, maxWidth: "100%", height: "auto" }}
        />
        {content.caption && (
            <p
                style={{
                    margin: "8px 0 0 0",
                    fontSize: "0.875rem",
                    color: "#666",
                    fontStyle: "italic",
                }}
            >
                {content.caption}
            </p>
        )}
    </div>
);

export default SectionPreviewImage;

