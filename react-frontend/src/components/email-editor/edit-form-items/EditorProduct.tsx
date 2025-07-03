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
        image: string;
        title: string;
        desc: string;
        price: string;
        button: {
            text: string;
            url: string;
            backgroundColor: string;
            textColor: string;
        };
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

const EditorProduct: React.FC<Props> = ({
                                            content,
                                            updateContent,
                                            variables,
                                            baseProps,
                                            buildSlotProps,
                                            openMediaLibrary,
                                        }) => {
    const setBtn = (
        field: keyof typeof content.button,
        value: string
    ) => updateContent("button", { ...content.button, [field]: value });

    return (
        <Stack>
            <TextField
                label="Product image URL"
                {...baseProps}
                value={content.image}
                onChange={(e) => updateContent("image", e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => openMediaLibrary("image", "image")}>
                                    <ImageIcon />
                                </IconButton>
                                <InsertVariableMenu
                                    variables={variables}
                                    onInsert={(t) => updateContent("image", content.image + t)}
                                />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                label="Title"
                {...baseProps}
                value={content.title}
                onChange={(e) => updateContent("title", e.target.value)}
                slotProps={buildSlotProps("title", content.title, variables, updateContent)}
            />
            <TextField
                label="Description"
                multiline
                minRows={3}
                {...baseProps}
                value={content.desc}
                onChange={(e) => updateContent("desc", e.target.value)}
                slotProps={buildSlotProps("desc", content.desc, variables, updateContent)}
            />
            <TextField
                label="Price"
                {...baseProps}
                value={content.price}
                onChange={(e) => updateContent("price", e.target.value)}
            />

            {/* Button */}
            <TextField
                label="Button text"
                {...baseProps}
                value={content.button.text}
                onChange={(e) => setBtn("text", e.target.value)}
                slotProps={buildSlotProps(
                    "button.text",
                    content.button.text,
                    variables,
                    (_k, v) => setBtn("text", v)
                )}
            />
            <TextField
                label="Button URL"
                {...baseProps}
                value={content.button.url}
                onChange={(e) => setBtn("url", e.target.value)}
                slotProps={buildSlotProps(
                    "button.url",
                    content.button.url,
                    variables,
                    (_k, v) => setBtn("url", v)
                )}
            />
            <TextField
                label="Button background color"
                {...baseProps}
                value={content.button.backgroundColor}
                onChange={(e) => setBtn("backgroundColor", e.target.value)}
            />
            <TextField
                label="Button text color"
                {...baseProps}
                value={content.button.textColor}
                onChange={(e) => setBtn("textColor", e.target.value)}
            />
        </Stack>
    );
};

export default EditorProduct;
