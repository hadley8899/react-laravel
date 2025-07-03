import React from "react";

interface SocialContent {
    iconSize: string;
    iconColor: string;
    facebook?: string;
    instagram?: string;
    x?: string;
    linkedin?: string;
}

const SectionPreviewSocial: React.FC<{ content: SocialContent }> = ({ content }) => {
    const size = parseInt(content.iconSize, 10) || 24;
    const links = [
        { key: "facebook", label: "F" },
        { key: "instagram", label: "I" },
        { key: "x", label: "X" },
        { key: "linkedin", label: "L" },
    ].filter((l) => (content as any)[l.key]);
    return (
        <div style={{ padding: 16, textAlign: "center" }}>
            {links.map((l) => (
                <a
                    key={l.key}
                    href={(content as any)[l.key]}
                    style={{
                        display: "inline-block",
                        width: size,
                        height: size,
                        lineHeight: `${size}px`,
                        margin: "0 6px",
                        borderRadius: "50%",
                        background: content.iconColor,
                        color: "#fff",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontSize: size * 0.55,
                    }}
                >
                    {l.label}
                </a>
            ))}
        </div>
    );
};

export default SectionPreviewSocial;

