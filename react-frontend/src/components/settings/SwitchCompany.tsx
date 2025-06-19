import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Autocomplete,
    TextField
} from "@mui/material";
import {hasPermission, getAuthUserLocal, setAuthUser} from "../../services/authService";
import {api} from "../../services/api";
import User from "../../interfaces/User";

interface Company {
    id: number;
    uuid: string;
    name: string;
}

interface SwitchCompanyModalProps {
    open: boolean;
    onClose: () => void;
}

const SwitchCompanyModal: React.FC<SwitchCompanyModalProps> = ({open, onClose}) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!hasPermission("switch_companies")) return;
        if (open) {
            api.get<{ data: Company[] }>("/companies").then(res => {
                setCompanies(res.data.data);
            });
        }
    }, [open]);

    const handleSwitch = async () => {
        if (!selectedCompany) return;
        setLoading(true);
        try {
            await api.post<{
                data: User
            }>("/companies/switch-company", {company_id: selectedCompany.uuid}).then((response) => {
                setTimeout(() => {
                    console.log(response.data.data);
                    setAuthUser(response.data.data);
                    window.location.reload();
                }, 500);
            });

        } finally {
            setLoading(false);
        }
    };

    if (!hasPermission("switch_companies")) return null;

    const user = getAuthUserLocal();
    const currentCompanyUuid = user?.company?.uuid;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Switch Company</DialogTitle>
            <DialogContent>
                <Typography sx={{mb: 2}}>Select a company to switch to:</Typography>
                <Autocomplete
                    options={companies}
                    getOptionLabel={(option) => option.name}
                    value={selectedCompany || companies.find(c => c.uuid === currentCompanyUuid) || null}
                    onChange={(_, value) => setSelectedCompany(value)}
                    renderInput={(params) => <TextField {...params} label="Company"/>}
                    isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
                    sx={{mb: 2}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSwitch}
                    disabled={
                        loading ||
                        !selectedCompany ||
                        selectedCompany.uuid === currentCompanyUuid
                    }
                >
                    Switch
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SwitchCompanyModal;
