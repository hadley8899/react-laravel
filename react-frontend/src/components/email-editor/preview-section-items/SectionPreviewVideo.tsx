import React from "react";

interface VideoContent {
    url: string;
    caption?: string;
}

const SectionPreviewVideo: React.FC<{ content: VideoContent }> = ({ content }) => (
    <div style={{ padding: 16, textAlign: "center" }}>
        <iframe
            src={content.url}
            style={{
                width: "100%",
                maxWidth: 640,
                height: 360,
                border: "none",
                borderRadius: 4,
            }}
            allowFullScreen
        />
        {content.caption && (
            <p style={{ marginTop: 8, fontSize: "0.875rem", color: "#666" }}>
                {content.caption}
            </p>
        )}
    </div>
);

export default SectionPreviewVideo;

