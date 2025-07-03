import React from "react";
import { Stack, TextField } from "@mui/material";
import { CompanyVariable } from "../../../interfaces/CompanyVariable";

interface Props {
    content: { url: string; caption: string };
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

const EditorVideo: React.FC<Props> = ({
                                          content,
                                          updateContent,
                                          variables,
                                          baseProps,
                                          buildSlotProps,
                                      }) => (
    <Stack>
        <TextField
            label="Video URL (YouTube, Vimeo, etc.)"
            {...baseProps}
            value={content.url}
            onChange={(e) => updateContent("url", e.target.value)}
            slotProps={buildSlotProps("url", content.url, variables, updateContent)}
        />
        <TextField
            label="Caption"
            multiline
            minRows={2}
            {...baseProps}
            value={content.caption}
            onChange={(e) => updateContent("caption", e.target.value)}
            slotProps={buildSlotProps(
                "caption",
                content.caption,
                variables,
                updateContent
            )}
        />
    </Stack>
);

export default EditorVideo;
