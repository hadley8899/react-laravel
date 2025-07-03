import React from "react";

interface Content {
    left: { text?: string; image?: string };
    right: { text?: string; image?: string };
}

const SectionPreviewImageWithLeftRightText: React.FC<{
    type: string;
    content: Content;
}> = ({ type, content }) => {
    const textFirst = type === "text_left_image_right";
    const text = textFirst ? content.left.text : content.right.text;
    const image = textFirst ? content.right.image : content.left.image;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: textFirst ? "row" : "row-reverse",
                alignItems: "center",
                gap: 16,
                padding: 16,
            }}
        >
            <p style={{ flex: 1, margin: 0, lineHeight: 1.6 }}>{text}</p>
            <img
                src={image}
                alt=""
                style={{ flex: 1, maxWidth: 280, borderRadius: 4 }}
            />
        </div>
    );
};

export default SectionPreviewImageWithLeftRightText;

