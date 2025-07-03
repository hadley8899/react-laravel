import React from "react";

interface Product {
    image: string;
    title: string;
    desc: string;
    price: string;
}

interface TwoProductsContent {
    products: Product[];
}

const SectionPreviewTwoProducts: React.FC<{ content: TwoProductsContent }> = ({ content }) => (
    <div
        style={{
            display: "flex",
            gap: 16,
            padding: 16,
            flexDirection: "row",
        }}
    >
        {content.products.map((p, idx) => (
            <div
                key={idx}
                style={{
                    border: "1px solid #eee",
                    padding: 16,
                    borderRadius: 4,
                    textAlign: "center",
                    flex: 1,
                }}
            >
                <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: 140, height: "auto", marginBottom: 12 }}
                />
                <h4 style={{ margin: "0 0 8px 0" }}>{p.title}</h4>
                <p style={{ margin: "0 0 8px 0" }}>{p.desc}</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{p.price}</p>
            </div>
        ))}
    </div>
);

export default SectionPreviewTwoProducts;

