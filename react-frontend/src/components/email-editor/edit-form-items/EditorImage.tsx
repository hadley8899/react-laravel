import React from "react";
import { Stack, TextField, InputAdornment, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InsertVariableMenu from "../InsertVariableMenu";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface EditorImageProps {
    content: {
        src: string;
        alt: string;
        width: string;
        caption: string;
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

const EditorImage: React.FC<EditorImageProps> = ({
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
                label="Image URL"
                {...baseProps}
                value={content.src}
                onChange={e => updateContent('src', e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => openMediaLibrary('src', 'image')}>
                                    <ImageIcon />
                                </IconButton>
                                <InsertVariableMenu
                                    variables={variables}
                                    onInsert={token => updateContent('src', content.src + token)}
                                />
                            </InputAdornment>
                        ),
                    }
                }}
            />
            <TextField
                label="Alt text"
                {...baseProps}
                value={content.alt}
                onChange={e => updateContent('alt', e.target.value)}
                slotProps={buildSlotProps('alt', content.alt, variables, updateContent)}
            />
            <TextField
                label="Width (e.g. 600px or 100%)"
                {...baseProps}
                value={content.width}
                onChange={e => updateContent('width', e.target.value)}
            />
            <TextField
                label="Caption"
                {...baseProps}
                value={content.caption}
                onChange={e => updateContent('caption', e.target.value)}
                slotProps={buildSlotProps('caption', content.caption, variables, updateContent)}
            />
        </Stack>
    );
};

export default EditorImage;

