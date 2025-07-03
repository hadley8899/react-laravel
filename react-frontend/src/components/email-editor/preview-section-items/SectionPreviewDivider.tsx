import React from "react";

interface DividerContent {
    height: string | number;
    color: string;
}

const SectionPreviewDivider: React.FC<{ content: DividerContent }> = ({ content }) => (
    <hr
        style={{
            height: content.height,
            background: content.color,
            border: "none",
            margin: 0,
        }}
    />
);

export default SectionPreviewDivider;

