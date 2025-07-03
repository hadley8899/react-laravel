import React from "react";

interface HeaderContent {
    backgroundColor: string;
    textColor: string;
    heading: string;
    subheading: string;
}

const SectionPreviewHeader: React.FC<{ content: HeaderContent }> = ({ content }) => (
    <div
        style={{
            backgroundColor: content.backgroundColor,
            color: content.textColor,
            padding: "24px",
            textAlign: "center",
        }}
    >
        <h2 style={{ margin: "0 0 8px 0", fontSize: "2rem" }}>
            {content.heading}
        </h2>
        <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
            {content.subheading}
        </p>
    </div>
);

export default SectionPreviewHeader;

