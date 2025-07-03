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
    content: { left: { text: string }; right: { image: string } };
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

const EditorTextLeftImageRight: React.FC<Props> = ({
                                                       content,
                                                       updateContent,
                                                       variables,
                                                       baseProps,
                                                       buildSlotProps,
                                                       openMediaLibrary,
                                                   }) => {
    const setLeft = (val: string) =>
        updateContent("left", { ...content.left, text: val });
    const setRight = (val: string) =>
        updateContent("right", { ...content.right, image: val });

    return (
        <Stack>
            <TextField
                label="Left column text"
                multiline
                minRows={4}
                {...baseProps}
                value={content.left.text}
                onChange={(e) => setLeft(e.target.value)}
                slotProps={buildSlotProps(
                    "left.text",
                    content.left.text,
                    variables,
                    (_k, v) => setLeft(v)
                )}
            />
            <TextField
                label="Right column image"
                {...baseProps}
                value={content.right.image}
                onChange={(e) => setRight(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => openMediaLibrary("right.image", "image")}
                                >
                                    <ImageIcon />
                                </IconButton>
                                <InsertVariableMenu
                                    variables={variables}
                                    onInsert={(t) => setRight(content.right.image + t)}
                                />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Stack>
    );
};

export default EditorTextLeftImageRight;
