import React, {useState} from "react";
import {
    Box, Button,
    Typography,
} from "@mui/material";
import { STATUS_HELPER } from "../../helpers/UserManagementHelper";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StatusHelper: React.FC = () => {

    const [showStatusHelper, setShowStatusHelper] = useState(true);

    return (
    <Box sx={{mb: 3}}>
        {showStatusHelper ? (
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    p: {xs: 1.5, sm: 2},
                    borderLeft: 4,
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: {xs: 'stretch', sm: 'flex-start'},
                    gap: 2,
                    flexDirection: {xs: 'column', sm: 'row'},
                    position: 'relative'
                }}
            >
                {/* Collapse button */}
                <Button
                    size="small"
                    onClick={() => setShowStatusHelper(false)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        minWidth: 0,
                        p: 0.5,
                        zIndex: 2,
                    }}
                    aria-label="Hide status helper"
                >
                    <KeyboardArrowUpIcon/>
                </Button>
                <InfoOutlinedIcon
                    color="primary"
                    sx={{
                        mt: {xs: 0, sm: 0.5},
                        alignSelf: {xs: 'center', sm: 'flex-start'},
                        fontSize: {xs: 32, sm: 24}
                    }}
                />
                <Box sx={{width: '100%'}}>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{textAlign: {xs: 'center', sm: 'left'}}}
                    >
                        What do user statuses mean?
                    </Typography>
                    <Box
                        component="ul"
                        sx={{
                            pl: {xs: 0, sm: 3},
                            mb: 0,
                            display: 'flex',
                            flexDirection: {xs: 'row', sm: 'column'},
                            overflowX: {xs: 'auto', sm: 'visible'},
                            gap: {xs: 2, sm: 0},
                            listStyle: 'none'
                        }}
                    >
                        {STATUS_HELPER.map(status => (
                            <li
                                key={status.label}
                                style={{
                                    minWidth: 220,
                                    marginBottom: 4,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'inline-block',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: status.color,
                                            mr: 1
                                        }}
                                    />
                                    <Typography component="span" fontWeight="bold"
                                                sx={{mr: 1, fontSize: {xs: 13, sm: 14}}}>
                                        {status.label}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: {xs: 12, sm: 14},
                                            whiteSpace: {xs: 'normal', sm: 'inherit'}
                                        }}
                                    >
                                        {status.description}
                                    </Typography>
                                </Box>
                            </li>
                        ))}
                    </Box>
                </Box>
            </Box>
        ) : (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    py: 0.5,
                    px: 2,
                    borderLeft: 4,
                    borderColor: 'primary.main',
                    cursor: 'pointer',
                    width: 'fit-content',
                    mx: 'auto'
                }}
                onClick={() => setShowStatusHelper(true)}
                aria-label="Show status helper"
            >
                <KeyboardArrowDownIcon fontSize="small" sx={{mr: 0.5}}/>
                <Typography variant="body2" color="primary">
                    Show status helper
                </Typography>
            </Box>
        )}
    </Box>
    );

}

export default StatusHelper;