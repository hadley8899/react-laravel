import React from "react";

interface ImageItem {
    src: string;
    alt?: string;
}

interface ImageMultipleContent {
    images: ImageItem[];
}

const SectionPreviewImageMultiple: React.FC<{ content: ImageMultipleContent }> = ({ content }) => (
    <div
        style={{
            display: "flex",
            gap: 16,
            padding: 16,
            justifyContent: "center",
        }}
    >
        {content.images.map((img, idx) => (
            <img
                key={idx}
                src={img.src}
                alt={img.alt}
                style={{ width: "100%", maxWidth: 280, borderRadius: 4 }}
            />
        ))}
    </div>
);

export default SectionPreviewImageMultiple;

