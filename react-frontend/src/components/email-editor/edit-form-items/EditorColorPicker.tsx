import {Box, Typography} from "@mui/material";
import {MuiColorInput} from "mui-color-input";
import React from "react";

interface ColorFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

const EditorColorPicker: React.FC<ColorFieldProps> = ({
                        label,
                        value,
                        onChange,
                    }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
            {label}
        </Typography>
        <MuiColorInput format="hex" size="small" value={value} onChange={onChange} sx={{ width: '100%' }} />
    </Box>
);

export default EditorColorPicker;