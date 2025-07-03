import React from "react";

interface FooterContent {
    backgroundColor: string;
    textColor: string;
    companyName: string;
    address: string;
    unsubscribeText: string;
}

const SectionPreviewFooter: React.FC<{ content: FooterContent }> = ({ content }) => (
    <div
        style={{
            backgroundColor: content.backgroundColor,
            color: content.textColor,
            padding: "16px",
            textAlign: "center",
            fontSize: 14,
        }}
    >
        <p style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
            {content.companyName}
        </p>
        <p style={{ margin: "0 0 8px 0" }}>{content.address}</p>
        <p style={{ margin: 0, textDecoration: "underline" }}>
            {content.unsubscribeText}
        </p>
    </div>
);

export default SectionPreviewFooter;

