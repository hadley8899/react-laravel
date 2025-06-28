import React from "react";
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Stack,
    Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {CompanyVariable} from "../../../interfaces/CompanyVariable.ts";

interface VariableTableProps {
    variables: Array<CompanyVariable>;
    openCreateDialog: () => void;
    openEditDialog: (variable: any) => void;
    handleDelete: (uuid: string, canBeDeleted: boolean) => void;
}

const VariableTable: React.FC<VariableTableProps> = ({
    variables,
    openCreateDialog,
    openEditDialog,
    handleDelete,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        // Mobile: Card layout
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={openCreateDialog}
                    >
                        Add Variable
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {variables.map((v) => (
                        <Paper key={v.uuid} variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={1}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Friendly Name</Typography>
                                    <Typography>{v.friendly_name}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Key</Typography>
                                    <Typography component="span"><code>{`{{${v.key}}}`}</code></Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Value</Typography>
                                    <Typography sx={{ wordBreak: 'break-all' }}>{v.value}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                                    <Typography>{v.type}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => openEditDialog(v)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(v.uuid, v.can_be_deleted)}
                                        disabled={!v.can_be_deleted}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Box>
        );
    }

    // Desktop: Table layout
    return (
        <Paper variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Friendly Name</TableCell>
                        <TableCell>Key</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">
                            <Button
                                variant="text"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={openCreateDialog}
                            >
                                Add Variable
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {variables.map((v) => (
                        <TableRow key={v.uuid}>
                            <TableCell>{v.friendly_name}</TableCell>
                            <TableCell>
                                <code>{`{{${v.key}}}`}</code>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 250, wordBreak: 'break-all' }}>
                                {v.value}
                            </TableCell>
                            <TableCell>{v.type}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    size="small"
                                    onClick={() => openEditDialog(v)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(v.uuid, v.can_be_deleted)}
                                    disabled={!v.can_be_deleted}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default VariableTable;