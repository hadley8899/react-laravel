import React from 'react';
import {
    Box, Divider, List, ListItem, Paper, Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import AppointmentCard from './AppointmentCard';
import {Appointment} from "../../interfaces/Appointment.ts";

interface Props {
    groupedAppointments: Record<string, Appointment[]>;
    weekDates: dayjs.Dayjs[];
    loading: boolean;
}

const heading = (d: dayjs.Dayjs) => d.format('ddd, MMM D');
const iso = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');

const AppointmentList: React.FC<Props> = ({
                                              groupedAppointments,
                                              weekDates,
                                              loading,
                                          }) => {
    const today = dayjs();

    return (
        <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 1,
                pb: 1,
            }}
        >
            {weekDates.map((d) => {
                const key = iso(d);
                const dayApps = groupedAppointments[key] ?? [];
                const isToday = d.isSame(today, 'day');

                return (
                    <Box
                        key={key}
                        sx={{
                            minWidth: 260,        // wider cards → single line on desktop
                            flexShrink: 0,
                        }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                height: '100%',
                                bgcolor: isToday ? (t) => t.palette.action.selected : 'inherit',
                                border: isToday ? (t) => `2px solid ${t.palette.primary.main}` : undefined,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                align="center"
                                gutterBottom
                                fontWeight={isToday ? 'bold' : 'normal'}
                            >
                                {heading(d)}
                            </Typography>
                            <Divider sx={{ mb: 1 }} />

                            {loading ? (
                                <Typography variant="body2" align="center">
                                    Loading…
                                </Typography>
                            ) : dayApps.length ? (
                                <List dense disablePadding>
                                    {dayApps.map((a) => (
                                        <ListItem key={a.uuid} disableGutters sx={{ p: 0, mb: 1 }}>
                                            <AppointmentCard appointment={a} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ mt: 2 }}
                                >
                                    No appointments
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                );
            })}
        </Box>
    );
};

export default AppointmentList;
