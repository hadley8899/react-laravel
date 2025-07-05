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
        return (
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 1}}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={openCreateDialog}
                    >
                        Add Variable
                    </Button>
                </Box>

                {!variables || variables.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No variables yet. Click “Add Variable” to create your first one.
                        </Typography>)
                    : (

                        <Stack spacing={2}>
                            {variables.map((v) => (
                                <Paper key={v?.uuid?.toString() + Math.random().toString()} variant="outlined" sx={{p: 2}}>
                                    <Stack spacing={1}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Friendly
                                                Name</Typography>
                                            <Typography>{v.friendly_name}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Key</Typography>
                                            <Typography component="span"><code>{`{{${v.key}}}`}</code></Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Value</Typography>
                                            {v.type === 'image' ? (
                                                v.url ? (
                                                    <Box
                                                        component="img"
                                                        src={v.url}
                                                        alt={v.friendly_name? v.friendly_name : 'Variable Image'}
                                                        sx={{maxWidth: '100px', maxHeight: '100px', mt: 1}}
                                                    />
                                                ) : (
                                                    <Typography color="text.secondary" variant="body2">
                                                        No image
                                                    </Typography>
                                                )
                                            ) : v.type === 'color' ? (
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '4px',
                                                            border: '1px solid #ccc',
                                                            backgroundColor: v.value,
                                                            display: 'inline-block',
                                                            mr: 1,
                                                        }}
                                                    />
                                                    <Typography component="span">{v.value}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography sx={{wordBreak: 'break-all', mt: 1}}>{v.value}</Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                                            <Typography>{v.type}</Typography>
                                        </Box>
                                        <Divider sx={{my: 1}}/>
                                        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                                            <IconButton
                                                size="small"
                                                onClick={() => openEditDialog(v)}
                                            >
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(v.uuid, v.can_be_deleted)}
                                                disabled={!v.can_be_deleted}
                                            >
                                                <DeleteIcon fontSize="small"/>
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    )}
            </Box>
        );
    }

    return (
        <Paper variant="outlined" sx={{mb: 3}}>

            {!variables || variables.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No variables yet. Click “Add Variable” to create your first one.
                    </Typography>)
                : (

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Friendly Name</TableCell>
                                <TableCell>Key</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={openCreateDialog}
                                    >
                                        Add Variable
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {variables.map((v) => (
                                <TableRow key={v.uuid?.toString() + Math.random().toString()}>
                                    <TableCell>{v.friendly_name}</TableCell>
                                    <TableCell>
                                        <code>{`{{${v.key}}}`}</code>
                                    </TableCell>

                                    {v.type === 'image' ? (
                                        <TableCell sx={{maxWidth: 250, wordBreak: 'break-all'}}>
                                            {v.url ? (
                                                <Box
                                                    component="img"
                                                    src={v.url}
                                                    alt={v.friendly_name ? v.friendly_name : 'Variable Image'}
                                                    sx={{maxWidth: '100px', maxHeight: '100px'}}
                                                />
                                            ) : (
                                                <Typography color="text.secondary" variant="body2">
                                                    No image
                                                </Typography>
                                            )}
                                        </TableCell>
                                    ) : v.type === 'color' ? (
                                        <TableCell sx={{maxWidth: 250, wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 1}}>
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: v.value,
                                                    display: 'inline-block',
                                                    mr: 1,
                                                }}
                                            />
                                            <Typography component="span">{v.value}</Typography>
                                        </TableCell>
                                    ) : (
                                        <TableCell sx={{maxWidth: 250, wordBreak: 'break-all'}}>
                                            {v.value}
                                        </TableCell>
                                    )}


                                    <TableCell>{v.type}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => openEditDialog(v)}
                                        >
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(v.uuid, v.can_be_deleted)}
                                            disabled={!v.can_be_deleted}
                                        >
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
        </Paper>
    )
}

export default VariableTable;

