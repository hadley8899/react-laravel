import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Paper,
} from '@mui/material';

interface Option {
    value: string;
    label: string;
}

interface Props {
    headings: string[];
    mapping: Record<string, string>;
    setMapping: (m: Record<string, string>) => void;
    options: Option[];
}

const ColumnMapperTable: React.FC<Props> = ({
                                                headings, mapping, setMapping, options,
                                            }) => {
    const handle = (col: string, val: string) =>
        setMapping({...mapping, [col]: val});

    return (
        <TableContainer component={Paper} sx={{mt: 2}}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Spreadsheet column</TableCell>
                        <TableCell>Import as</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {headings.map((h) => (
                        <TableRow key={h}>
                            <TableCell sx={{fontWeight: 500}}>{h}</TableCell>
                            <TableCell>
                                <Select
                                    size="small"
                                    value={mapping[h] ?? 'IGNORE'}
                                    onChange={(e) => handle(h, e.target.value as string)}
                                    sx={{minWidth: 180}}
                                >
                                    {options.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ColumnMapperTable;
