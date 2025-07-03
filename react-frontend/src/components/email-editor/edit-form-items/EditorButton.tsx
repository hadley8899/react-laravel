import React from "react";
import { Stack, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditorColorPicker from "./EditorColorPicker.tsx";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface EditorButtonProps {
    content: {
        text: string;
        url: string;
        backgroundColor: string;
        textColor: string;
        alignment: string;
    };
    updateContent: (key: string, value: string) => void;
    variables: CompanyVariable[];
    baseProps: Record<string, any>;
    buildSlotProps: (
        key: string,
        value: string,
        variables: CompanyVariable[],
        updateContent: (key: string, value: string) => void
    ) => Record<string, any>;
    openMediaLibrary: (field: string, type: 'image' | 'all') => void;
}

const EditorButton: React.FC<EditorButtonProps> = ({
    content,
    updateContent,
    variables,
    baseProps,
    buildSlotProps,
    openMediaLibrary
}) => {
    return (
        <Stack>
            <TextField
                label="Button text"
                {...baseProps}
                value={content.text}
                onChange={e => updateContent('text', e.target.value)}
                slotProps={buildSlotProps('text', content.text, variables, updateContent)}
            />
            <TextField
                label="URL"
                {...baseProps}
                value={content.url}
                onChange={e => updateContent('url', e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => openMediaLibrary('url', 'all')}>
                                    <AttachFileIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }
                }}
            />
            <EditorColorPicker
                label="Background"
                value={content.backgroundColor}
                onChange={v => updateContent('backgroundColor', v)}
            />
            <EditorColorPicker label="Text colour" value={content.textColor} onChange={v => updateContent('textColor', v)} />
            <FormControl {...baseProps}>
                <InputLabel id="btn-align">Alignment</InputLabel>
                <Select
                    labelId="btn-align"
                    label="Alignment"
                    size="small"
                    value={content.alignment}
                    onChange={e => updateContent('alignment', e.target.value)}
                >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
};

export default EditorButton;

