import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface EditorListProps {
    content: {
        listType: string;
        items: string[];
    };
    updateContent: (key: string, value: any) => void;
    variables: CompanyVariable[];
    baseProps: Record<string, any>;
}

const EditorList: React.FC<EditorListProps> = ({
    content,
    updateContent,
    baseProps
}) => {
    return (
        <Stack>
            <FormControl {...baseProps}>
                <InputLabel id="list-type">List type</InputLabel>
                <Select
                    labelId="list-type"
                    label="List type"
                    size="small"
                    value={content.listType}
                    onChange={e => updateContent('listType', e.target.value)}
                >
                    <MenuItem value="bullet">Bullet</MenuItem>
                    <MenuItem value="number">Numbered</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Items (one per line)"
                multiline
                minRows={4}
                {...baseProps}
                value={content.items.join('\n')}
                onChange={e => updateContent('items', e.target.value.split('\n'))}
            />
        </Stack>
    );
};

export default EditorList;

