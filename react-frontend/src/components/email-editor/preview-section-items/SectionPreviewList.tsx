import React from "react";

interface ListContent {
    listType: "bullet" | "number";
    items: string[];
}

const SectionPreviewList: React.FC<{ content: ListContent }> = ({ content }) => (
    <div style={{ padding: "16px" }}>
        {content.listType === "bullet" ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {content.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                        {item}
                    </li>
                ))}
            </ul>
        ) : (
            <ol style={{ margin: 0, paddingLeft: "20px" }}>
                {content.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                        {item}
                    </li>
                ))}
            </ol>
        )}
    </div>
);

export default SectionPreviewList;

