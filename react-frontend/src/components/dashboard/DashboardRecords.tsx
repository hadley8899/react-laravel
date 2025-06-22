import React, {useEffect, useState} from 'react';
import {
    Box, Card, CardHeader, Divider, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Avatar, Chip, Typography, IconButton,
    Grid, Skeleton, useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    getDashboardActivities,
    type Activity,
} from '../../services/DashboardService.ts';

const DashboardRecords: React.FC = () => {
    const theme = useTheme();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [data, setData] = useState<Activity[] | null>(null);

    /* load once */
    useEffect(() => {
        (async () => {
            try {
                const res = await getDashboardActivities();
                setData(res);
            } catch (e) {
                console.error('Activities API error', e);
            }
        })();
    }, []);

    const statusColor = (s: string) => {
        const color = ({
            paid: theme.palette.success,
            completed: theme.palette.success,
            scheduled: theme.palette.info,
            pending: theme.palette.warning,
            cancelled: theme.palette.error,
            overdue: theme.palette.error,
        } as const)[s] ?? theme.palette.grey;

        // Return an object with guaranteed light and dark properties

        return {
            // @ts-expect-error - TypeScript doesn't know the shape of color
            light: color.light || color.main || '#f0f0f0',
            // @ts-expect-error - TypeScript doesn't know the shape of color
            dark: color.dark || color.contrastText || '#000000'
        };
    };

    /* skeleton while loading */
    if (!data) {
        return (
            <Grid container spacing={3} mt={4}>
                <Grid size={{xs: 12}}>
                    <Skeleton variant="rectangular" height={400}/>
                </Grid>
            </Grid>
        );
    }

    /* paginated slice */
    const slice = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box mt={4}>
            <Card>
                <CardHeader
                    title="Recent Activities"
                    action={<IconButton><MoreVertIcon/></IconButton>}
                />
                <Divider/>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['User', 'Type', 'Description', 'Amount', 'Status', 'When', ''].map((h) => (
                                    <TableCell key={h}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slice.map((a) => (
                                <TableRow key={a.id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Avatar
                                                src={a.user.avatar ?? undefined}
                                                sx={{mr: 2, width: 40, height: 40}}
                                            />
                                            <Typography variant="body2">{a.user.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{a.type}</TableCell>
                                    <TableCell>{a.description}</TableCell>
                                    <TableCell>{a.amount !== null ? `£${a.amount}` : '—'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={a.status}
                                            sx={{
                                                bgcolor: statusColor(a.status).light,
                                                color: statusColor(a.status).dark,
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{a.date_diff}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small">
                                            <VisibilityIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                />
            </Card>
        </Box>
    );
};

export default DashboardRecords;
