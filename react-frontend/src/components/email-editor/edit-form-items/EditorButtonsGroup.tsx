import React from "react";
import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface Props {
    content: {
        buttons: {
            text: string;
            url: string;
            backgroundColor: string;
            textColor: string;
        }[];
        alignment: string;
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
}

const EditorButtonsGroup: React.FC<Props> = ({
                                                 content,
                                                 updateContent,
                                                 variables,
                                                 baseProps,
                                                 buildSlotProps,
                                             }) => {
    const setBtn = (
        idx: number,
        field: keyof (typeof content.buttons)[0],
        value: string
    ) => {
        const next = [...content.buttons];
        // @ts-ignore
        next[idx][field] = value;
        updateContent("buttons", next);
    };

    return (
        <Stack>
            {content.buttons.map((btn, idx) => (
                <Stack key={idx} sx={{ mb: 2 }}>
                    <TextField
                        label={`Button ${idx + 1} text`}
                        {...baseProps}
                        value={btn.text}
                        onChange={(e) => setBtn(idx, "text", e.target.value)}
                        slotProps={buildSlotProps(
                            `buttons.${idx}.text`,
                            btn.text,
                            variables,
                            (_k, v) => setBtn(idx, "text", v)
                        )}
                    />
                    <TextField
                        label={`Button ${idx + 1} URL`}
                        {...baseProps}
                        value={btn.url}
                        onChange={(e) => setBtn(idx, "url", e.target.value)}
                        slotProps={buildSlotProps(
                            `buttons.${idx}.url`,
                            btn.url,
                            variables,
                            (_k, v) => setBtn(idx, "url", v)
                        )}
                    />
                    <TextField
                        label={`Button ${idx + 1} background color`}
                        {...baseProps}
                        value={btn.backgroundColor}
                        onChange={(e) => setBtn(idx, "backgroundColor", e.target.value)}
                    />
                    <TextField
                        label={`Button ${idx + 1} text color`}
                        {...baseProps}
                        value={btn.textColor}
                        onChange={(e) => setBtn(idx, "textColor", e.target.value)}
                    />
                </Stack>
            ))}

            <FormControl {...baseProps}>
                <InputLabel id="align">Alignment</InputLabel>
                <Select
                    labelId="align"
                    label="Alignment"
                    size="small"
                    value={content.alignment}
                    onChange={(e) => updateContent("alignment", e.target.value)}
                >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
};

export default EditorButtonsGroup;
