import React from "react";
import { Stack, TextField } from "@mui/material";
import {TemplateVariable} from "../../../services/VariableCatalogueService.ts";

interface Props {
    content: { columns: { text: string }[] };
    updateContent: (key: string, value: any) => void;
    variables: TemplateVariable[];
    baseProps: Record<string, any>;
    buildSlotProps: (
        key: string,
        value: string,
        vars: TemplateVariable[],
        update: (k: string, v: string) => void
    ) => Record<string, any>;
}

const EditorColumnsText: React.FC<Props> = ({
                                                content,
                                                updateContent,
                                                variables,
                                                baseProps,
                                                buildSlotProps,
                                            }) => {
    const handleChange = (idx: number, val: string) => {
        const next = [...content.columns];
        next[idx].text = val;
        updateContent("columns", next);
    };

    return (
        <Stack>
            {content.columns.map((col, idx) => (
                <TextField
                    key={idx}
                    label={`Column ${idx + 1} text`}
                    multiline
                    minRows={3}
                    {...baseProps}
                    value={col.text}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    slotProps={buildSlotProps(
                        `columns.${idx}.text`,
                        col.text,
                        variables,
                        (_k, v) => handleChange(idx, v)
                    )}
                />
            ))}
        </Stack>
    );
};

export default EditorColumnsText;
