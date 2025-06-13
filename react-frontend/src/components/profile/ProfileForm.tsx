import React, {useRef, useState} from 'react';
import {
    Box, Stack, TextField, InputAdornment, IconButton, Button,
    Tooltip, Avatar, Typography, Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';

import User from '../../interfaces/User';

interface ProfileFormProps {
    user: User;
    onSave: (name: string, email: string, avatar: File | null) => Promise<void>;
    onLogout: () => void;
    onChangePassword: () => void;
    loading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    user,
    onSave,
    onLogout,
    onChangePassword,
    loading
}) => {
    const fileRef = useRef<HTMLInputElement>(null);

    // Form state
    const [editing, setEdit] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const avatarPreview = avatarFile
        ? URL.createObjectURL(avatarFile)
        : user?.avatar_url ?? '';

    // Handle save
    const handleSave = async () => {
        await onSave(name, email, avatarFile);
        setEdit(false);
        setAvatarFile(null);
    };

    // Avatar selection
    const pickAvatar = () => fileRef.current?.click();
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    return (
        <Stack direction={{xs: 'column', md: 'row'}} spacing={4} alignItems="center">
            {/* Avatar + role */}
            <Box textAlign="center">
                <Tooltip title={editing ? 'Change avatar' : ''}>
                    <Avatar
                        src={avatarPreview}
                        sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 2,
                            cursor: editing ? 'pointer' : 'default'
                        }}
                        onClick={editing ? pickAvatar : undefined}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                </Tooltip>
                <input
                    ref={fileRef}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                />
                <Typography variant="h6" gutterBottom>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">Administrator</Typography>
            </Box>
            <Box flexGrow={1} width="100%">
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">Profile Settings</Typography>
                    <Tooltip title={editing ? 'Cancel' : 'Edit'}>
                        <IconButton onClick={() => {
                            if (editing) {
                                // Reset form
                                setName(user.name);
                                setEmail(user.email);
                                setAvatarFile(null);
                            }
                            setEdit(!editing);
                        }}>
                            <EditIcon color={editing ? 'secondary' : 'primary'}/>
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/* Form fields */}
                <Stack spacing={2}>
                    <TextField
                        label="Full Name"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                        variant={editing ? 'outlined' : 'filled'}
                        slotProps={{
                            input: {
                                readOnly: !editing,
                                startAdornment: <InputAdornment position="start"><PersonIcon/></InputAdornment>
                            }
                        }}
                    />
                    <TextField
                        label="Email Address"
                        fullWidth
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        variant={editing ? 'outlined' : 'filled'}
                        slotProps={{
                            input: {
                                readOnly: !editing,
                                startAdornment: <InputAdornment position="start"><EmailIcon/></InputAdornment>
                            }
                        }}
                    />

                    {editing && (
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon/>}
                            onClick={handleSave}
                            sx={{alignSelf: 'flex-start'}}
                            disabled={loading}
                        >
                            Save Changes
                        </Button>
                    )}
                </Stack>

                <Divider sx={{my: 4}}/>

                <Typography variant="h6" gutterBottom>Security & Actions</Typography>
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    spacing={2}
                    flexWrap="wrap"
                    alignItems="stretch"
                >
                    <Button
                        variant="outlined"
                        startIcon={<LockResetIcon/>}
                        onClick={onChangePassword}
                        fullWidth
                        sx={{
                            maxWidth: {sm: 200},
                            width: {xs: '100%', sm: 'auto'}
                        }}
                    >
                        Change Password
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon/>}
                        onClick={onLogout}
                        fullWidth
                        sx={{
                            maxWidth: {sm: 200},
                            width: {xs: '100%', sm: 'auto'}
                        }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>
        </Stack>
    );
};

export default ProfileForm;
