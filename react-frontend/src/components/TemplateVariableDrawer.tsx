import React from 'react';
import {
    Drawer,
    List,
    ListSubheader,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
    IconButton,
    Box,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useNotifier} from '../context/NotificationContext';
import {TemplateVariable} from "../services/VariableCatalogueService.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    variables: TemplateVariable[];
    onInsert: (placeholder: string) => void;
}

const TemplateVariableDrawer: React.FC<Props> = ({open, onClose, variables, onInsert}) => {
    const {showNotification} = useNotifier();

    const groups = {
        company: variables.filter(v => v.scope === 'company'),
        customer: variables.filter(v => v.scope === 'customer'),
    };

    const VariableRow: React.FC<{ v: TemplateVariable }> = ({v}) => (
        <ListItemButton
            dense
            sx={{pl: 2}}
            onClick={() => {
                onInsert(v.key);
                onClose();
                showNotification(`Inserted {{${v.key}}}`);
            }}
        >
            <ListItemText
                primary={<Typography sx={{fontWeight: 500}}>{v.friendly_name}</Typography>}
                secondary={`{{${v.key}}}`}
            />
            <Tooltip title="Copy placeholder">
                <IconButton
                    edge="end"
                    onClick={e => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`{{${v.key}}}`);
                        showNotification('Copied to clipboard');
                    }}
                >
                    <ContentCopyIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
        </ListItemButton>
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{width: 320, maxWidth: '100%'}}>
                {(['company', 'customer'] as const).map(scope =>
                    groups[scope].length ? (
                        <List
                            key={scope}
                            subheader={<ListSubheader>{scope.toUpperCase()} VARIABLES</ListSubheader>}
                            sx={{p: 0}}
                        >
                            {groups[scope].map(v => (
                                <VariableRow key={v.key} v={v}/>
                            ))}
                        </List>
                    ) : null
                )}
                {variables.length === 0 && (
                    <Typography sx={{p: 3}} color="text.secondary">
                        No variables available
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
};

export default TemplateVariableDrawer;
