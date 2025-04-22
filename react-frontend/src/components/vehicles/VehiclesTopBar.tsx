import React from "react";
import {Box, Button, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface VehiclesTopBarProps {
    selectedVehicles: number[];
}

const VehiclesTopBar: React.FC<VehiclesTopBarProps> = ({selectedVehicles}) => {
    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                mb: 2,
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {/* Title / Selection Count */}
            <Typography
                variant={selectedVehicles.length > 0 ? "subtitle1" : "h6"}
                component="div"
                sx={{flexGrow: 1, flexShrink: 1, mr: 2}} // Allow growing/shrinking, add margin
            >
                {selectedVehicles.length > 0
                    ? `${selectedVehicles.length} selected`
                    : "All Vehicles"}
            </Typography>

            {/* Actions Group */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'nowrap',
                    flexShrink: 0
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    size="small"
                >
                    Add Vehicle
                </Button>

                <Tooltip title="Filter list">
                    <IconButton size="small">
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Edit selected vehicle">
                    <span>
                        <IconButton size="small" disabled={selectedVehicles.length !== 1}>
                            <EditIcon/>
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Delete selected vehicles">
                    <span>
                        <IconButton size="small" disabled={selectedVehicles.length === 0}>
                            <DeleteIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Toolbar>
    );
}

export default VehiclesTopBar;
