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
    content: { images: { src: string; alt: string }[] };
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

const EditorTwoImages: React.FC<Props> = ({
                                              content,
                                              updateContent,
                                              variables,
                                              baseProps,
                                              buildSlotProps,
                                              openMediaLibrary,
                                          }) => {
    const setImg = (
        idx: number,
        field: "src" | "alt",
        value: string
    ) => {
        const next = [...content.images];
        next[idx][field] = value;
        updateContent("images", next);
    };

    return (
        <Stack>
            {content.images.map((img, idx) => (
                <Stack key={idx} sx={{ mb: 2 }}>
                    <TextField
                        label={`Image ${idx + 1} URL`}
                        {...baseProps}
                        value={img.src}
                        onChange={(e) => setImg(idx, "src", e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                openMediaLibrary(`images.${idx}.src`, "image")
                                            }
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                        <InsertVariableMenu
                                            variables={variables}
                                            onInsert={(t) => setImg(idx, "src", img.src + t)}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label={`Image ${idx + 1} alt text`}
                        {...baseProps}
                        value={img.alt}
                        onChange={(e) => setImg(idx, "alt", e.target.value)}
                        slotProps={buildSlotProps(
                            `images.${idx}.alt`,
                            img.alt,
                            variables,
                            (_k, v) => setImg(idx, "alt", v)
                        )}
                    />
                </Stack>
            ))}
        </Stack>
    );
};

export default EditorTwoImages;
