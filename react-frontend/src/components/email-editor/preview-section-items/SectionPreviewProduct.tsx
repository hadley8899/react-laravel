import React from "react";

interface ProductContent {
    image: string;
    title: string;
    desc: string;
    price: string;
}

const SectionPreviewProduct: React.FC<{ content: ProductContent }> = ({ content }) => (
    <div
        style={{
            border: "1px solid #eee",
            padding: 16,
            borderRadius: 4,
            textAlign: "center",
            maxWidth: 320,
            margin: "0 auto",
        }}
    >
        <img
            src={content.image}
            alt={content.title}
            style={{ width: 160, height: "auto", marginBottom: 12 }}
        />
        <h3 style={{ margin: "0 0 8px 0" }}>{content.title}</h3>
        <p style={{ margin: "0 0 8px 0" }}>{content.desc}</p>
        <p style={{ margin: 0, fontWeight: 700 }}>{content.price}</p>
    </div>
);

export default SectionPreviewProduct;

