import React from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {ContactCustomVariable} from '../../interfaces/ContactCustomVariable';

interface Props {
    variables: ContactCustomVariable[];
    onEdit: (variable: ContactCustomVariable) => void;
    onDelete: (variable: ContactCustomVariable) => void;
}

const CustomVariableTable: React.FC<Props> = ({variables, onEdit, onDelete}) => (
    <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Merge-Tag</TableCell>
                <TableCell sx={{width: 90}}/>
            </TableRow>
        </TableHead>
        <TableBody>

            {variables.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{py: 6, color: 'text.secondary'}}>
                        No custom contact fields yet — click “New Field” to add one.
                    </TableCell>
                </TableRow>
            )}

            {variables.map((v) => (
                <TableRow key={v.uuid}>
                    <TableCell>{v.friendly_name}</TableCell>
                    <TableCell><code>{`{{ ${v.key} }}`}</code></TableCell>
                    <TableCell>
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEdit(v)}>
                                <EditIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => onDelete(v)}>
                                <DeleteIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default CustomVariableTable;
