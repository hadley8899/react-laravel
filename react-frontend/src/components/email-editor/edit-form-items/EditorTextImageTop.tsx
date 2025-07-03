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
    content: { image: string; text: string };
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

const EditorTextImageTop: React.FC<Props> = ({
                                                 content,
                                                 updateContent,
                                                 variables,
                                                 baseProps,
                                                 buildSlotProps,
                                                 openMediaLibrary,
                                             }) => (
    <Stack>
        <TextField
            label="Image URL"
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
            label="Text content"
            multiline
            minRows={4}
            {...baseProps}
            value={content.text}
            onChange={(e) => updateContent("text", e.target.value)}
            slotProps={buildSlotProps("text", content.text, variables, updateContent)}
        />
    </Stack>
);

export default EditorTextImageTop;
