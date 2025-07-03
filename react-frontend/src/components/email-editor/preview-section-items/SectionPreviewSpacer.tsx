import React from "react";

interface SpacerContent {
    height: string | number;
}

const SectionPreviewSpacer: React.FC<{ content: SpacerContent }> = ({ content }) => (
    <div style={{ height: content.height }} />
);

export default SectionPreviewSpacer;

