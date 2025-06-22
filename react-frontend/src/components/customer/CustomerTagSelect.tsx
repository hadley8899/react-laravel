import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    CircularProgress,
    TextField,
} from '@mui/material';
import {Tag} from '../../interfaces/Tag.ts';
import {getTags} from "../../services/TagService.ts";
import TagChip from '../TagChip.tsx';

interface CustomerTagSelectProps {
    value: Tag[];
    onChange: (tags: Tag[]) => void;
    disabled?: boolean;
}

const CustomerTagSelect: React.FC<CustomerTagSelectProps> = ({
                                                                 value,
                                                                 onChange,
                                                                 disabled = false,
                                                             }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);

    /* load tag options once */
    useEffect(() => {
        setLoading(true);
        getTags()
            .then(setTags)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            filterSelectedOptions
            options={tags}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.uuid === b.uuid}
            value={value}
            onChange={(_e, v) => onChange(v)}
            loading={loading}
            disabled={disabled}
            renderOption={(props, option) => (
                <li {...props}>
                    <TagChip tag={option} sx={{mr: 1}}/>
                    {option.name}
                </li>
            )}
            renderValue={(selected, getItemProps) =>
                selected.map((tag, idx) => (
                    <TagChip
                        tag={tag}
                        // key is handled by getItemProps
                        {...getItemProps({index: idx})}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tag…"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={20}/>}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }
                    }}
                />
            )}
        />
    );
};

export default CustomerTagSelect;
