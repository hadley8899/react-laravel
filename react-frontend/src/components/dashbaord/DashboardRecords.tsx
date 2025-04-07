import React, { useState } from "react";
import {
    Box,
    Card,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Avatar,
    Chip,
    Typography,
    IconButton,
    useTheme
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Sample data for recent activities
const activities = [
    {
        id: '1',
        user: {
            name: 'Emma Wilson',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        type: 'Purchase',
        description: 'Purchased Premium Plan',
        amount: '$59.99',
        status: 'completed',
        date: '2 hours ago'
    },
    {
        id: '2',
        user: {
            name: 'Michael Brown',
            avatar: 'https://i.pravatar.cc/150?img=2'
        },
        type: 'Subscription',
        description: 'Renewed Monthly Subscription',
        amount: '$9.99',
        status: 'completed',
        date: '5 hours ago'
    },
    {
        id: '3',
        user: {
            name: 'Sarah Davis',
            avatar: 'https://i.pravatar.cc/150?img=3'
        },
        type: 'Support',
        description: 'Opened support ticket #45892',
        amount: null,
        status: 'pending',
        date: '1 day ago'
    },
    {
        id: '4',
        user: {
            name: 'James Lee',
            avatar: 'https://i.pravatar.cc/150?img=4'
        },
        type: 'Refund',
        description: 'Requested refund for Order #38271',
        amount: '$24.99',
        status: 'pending',
        date: '1 day ago'
    },
    {
        id: '5',
        user: {
            name: 'Oliver Johnson',
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        type: 'Login',
        description: 'Suspicious login attempt blocked',
        amount: null,
        status: 'alert',
        date: '2 days ago'
    },
    {
        id: '6',
        user: {
            name: 'Sophia Martinez',
            avatar: 'https://i.pravatar.cc/150?img=6'
        },
        type: 'Purchase',
        description: 'Purchased Basic Plan',
        amount: '$29.99',
        status: 'completed',
        date: '3 days ago'
    },
    {
        id: '7',
        user: {
            name: 'William Thompson',
            avatar: 'https://i.pravatar.cc/150?img=7'
        },
        type: 'Subscription',
        description: 'Cancelled Premium Subscription',
        amount: null,
        status: 'cancelled',
        date: '4 days ago'
    }
];

const DashboardRecords: React.FC = () => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Status chip styling
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return theme.palette.success;
            case 'pending':
                return theme.palette.warning;
            case 'cancelled':
                return theme.palette.error;
            case 'alert':
                return theme.palette.error;
            default:
                return theme.palette.info;
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Card>
                <CardHeader
                    title="Recent Activities"
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
                <Divider />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Activity Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activities
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((activity) => (
                                    <TableRow key={activity.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    src={activity.user.avatar}
                                                    alt={activity.user.name}
                                                    sx={{ mr: 2, width: 40, height: 40 }}
                                                />
                                                <Typography variant="body2">{activity.user.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{activity.type}</TableCell>
                                        <TableCell>{activity.description}</TableCell>
                                        <TableCell>{activity.amount || '—'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={activity.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getStatusColor(activity.status).light,
                                                    color: getStatusColor(activity.status).dark,
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{activity.date}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small">
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={activities.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Box>
    );
};

export default DashboardRecords;
