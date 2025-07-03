import React from "react";
import {
    Stack,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InsertVariableMenu from "../InsertVariableMenu";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface Props {
    content: {
        products: { image: string; title: string; desc: string; price: string }[];
    };
    updateContent: (k: string, v: any) => void;
    variables: CompanyVariable[];
    baseProps: Record<string, any>;
    buildSlotProps: (
        k: string,
        v: string,
        vars: CompanyVariable[],
        update: (k: string, v: string) => void
    ) => Record<string, any>;
    openMediaLibrary: (field: string, type: "image" | "all") => void;
}

const EditorTwoProducts: React.FC<Props> = ({
                                                content,
                                                updateContent,
                                                variables,
                                                baseProps,
                                                buildSlotProps,
                                                openMediaLibrary,
                                            }) => {
    const setProd = (
        idx: number,
        field: keyof (typeof content.products)[0],
        value: string
    ) => {
        const next = [...content.products];
        // @ts-ignore
        next[idx][field] = value;
        updateContent("products", next);
    };

    return (
        <Stack>
            {content.products.map((p, idx) => (
                <Stack key={idx} sx={{ mb: 2 }}>
                    <TextField
                        label={`Product ${idx + 1} image URL`}
                        {...baseProps}
                        value={p.image}
                        onChange={(e) => setProd(idx, "image", e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                openMediaLibrary(`products.${idx}.image`, "image")
                                            }
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                        <InsertVariableMenu
                                            variables={variables}
                                            onInsert={(t) => setProd(idx, "image", p.image + t)}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label={`Product ${idx + 1} title`}
                        {...baseProps}
                        value={p.title}
                        onChange={(e) => setProd(idx, "title", e.target.value)}
                        slotProps={buildSlotProps(
                            `products.${idx}.title`,
                            p.title,
                            variables,
                            (_k, v) => setProd(idx, "title", v)
                        )}
                    />
                    <TextField
                        label={`Product ${idx + 1} description`}
                        multiline
                        minRows={3}
                        {...baseProps}
                        value={p.desc}
                        onChange={(e) => setProd(idx, "desc", e.target.value)}
                        slotProps={buildSlotProps(
                            `products.${idx}.desc`,
                            p.desc,
                            variables,
                            (_k, v) => setProd(idx, "desc", v)
                        )}
                    />
                    <TextField
                        label={`Product ${idx + 1} price`}
                        {...baseProps}
                        value={p.price}
                        onChange={(e) => setProd(idx, "price", e.target.value)}
                    />
                </Stack>
            ))}
        </Stack>
    );
};

export default EditorTwoProducts;
