import React from "react";

interface TextImageTopContent {
    image: string;
    text: string;
}

const SectionPreviewTextImageTop: React.FC<{ content: TextImageTopContent }> = ({ content }) => (
    <div style={{ padding: 16, textAlign: "center" }}>
        <img
            src={content.image}
            alt=""
            style={{ width: "100%", height: "auto", borderRadius: 4 }}
        />
        <p style={{ marginTop: 12 }}>{content.text}</p>
    </div>
);

export default SectionPreviewTextImageTop;

