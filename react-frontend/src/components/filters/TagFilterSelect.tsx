import React, { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Tag } from '../../interfaces/Tag';
import { getTags } from '../../services/TagService';
import TagChip from '../TagChip';

interface TagFilterSelectProps {
    value: Tag[];
    onChange: (tags: Tag[]) => void;
    disabled?: boolean;
}

const TagFilterSelect: React.FC<TagFilterSelectProps> = ({
                                                             value,
                                                             onChange,
                                                             disabled = false,
                                                         }) => {
    const [options, setOptions] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getTags()
            .then(setOptions)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Autocomplete
            multiple
            size="small"
            options={options}
            value={value}
            disableCloseOnSelect
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.uuid === b.uuid}
            onChange={(_e, v) => onChange(v)}
            filterSelectedOptions
            loading={loading}
            disabled={disabled}
            sx={{ minWidth: 220 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Filter by tags"
                    placeholder="Select tag"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={18} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }
                    }}
                />
            )}
            renderValue={(selected, getItemProps) =>
                selected.map((tag, idx) => (
                    <TagChip tag={tag} {...getItemProps({ index: idx })} />
                ))
            }
        />
    );
};

export default TagFilterSelect;
