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
    content: { left: { image: string }; right: { text: string } };
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

const EditorImageLeftTextRight: React.FC<Props> = ({
                                                       content,
                                                       updateContent,
                                                       variables,
                                                       baseProps,
                                                       buildSlotProps,
                                                       openMediaLibrary,
                                                   }) => {
    const setLeft = (val: string) =>
        updateContent("left", { ...content.left, image: val });
    const setRight = (val: string) =>
        updateContent("right", { ...content.right, text: val });

    return (
        <Stack>
            <TextField
                label="Left column image"
                {...baseProps}
                value={content.left.image}
                onChange={(e) => setLeft(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => openMediaLibrary("left.image", "image")}
                                >
                                    <ImageIcon />
                                </IconButton>
                                <InsertVariableMenu
                                    variables={variables}
                                    onInsert={(t) => setLeft(content.left.image + t)}
                                />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                label="Right column text"
                multiline
                minRows={4}
                {...baseProps}
                value={content.right.text}
                onChange={(e) => setRight(e.target.value)}
                slotProps={buildSlotProps(
                    "right.text",
                    content.right.text,
                    variables,
                    (_k, v) => setRight(v)
                )}
            />
        </Stack>
    );
};

export default EditorImageLeftTextRight;
