import React from 'react';
import {Badge, Box, Tab, Tabs} from "@mui/material";
import {USER_STATUSES} from "../../helpers/UserManagementHelper.ts";

// Props interface
interface StatusTabsProps {
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    statusCounts: Record<string, number>;
}

const StatusTabs: React.FC<StatusTabsProps> = ({selectedStatus, setSelectedStatus, statusCounts}) => {
    return (
        <Box sx={{mb: 2}}>
            <Tabs
                value={selectedStatus}
                onChange={(_, v) => setSelectedStatus(v)}
                variant="scrollable"
                scrollButtons="auto"
            >
                {USER_STATUSES.map(tab => (
                    <Tab
                        key={tab.value}
                        label={
                            (tab.value === "pending" || tab.value === "invited" || tab.value === "rejected" || tab.value === "active")
                                ? (
                                    <Badge
                                        color={tab.value === "pending" ? "warning" : tab.value === "invited" ? "info" : tab.value === "rejected" ? "error" : "success"}
                                        badgeContent={statusCounts[tab.value as keyof typeof statusCounts] || 0}
                                        max={99}
                                    >
                                        {tab.label}
                                    </Badge>
                                ) : tab.label
                        }
                        value={tab.value}
                    />
                ))}
            </Tabs>
        </Box>
    );
}

export default StatusTabs;