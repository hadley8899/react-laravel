import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {
    Box, Button, Grid, IconButton, MenuItem, Paper, TextField, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
    CreateInvoicePayload,
    InvoiceItemInput,
} from '../../services/InvoiceService.ts';
import {getCustomers} from '../../services/CustomerService';
import {Customer} from '../../interfaces/Customer';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

type Mode = 'create' | 'edit';

interface Props {
    onSubmit: (payload: CreateInvoicePayload) => Promise<void>;
    loading: boolean;
    mode?: Mode;
    initialValues?: CreateInvoicePayload;
}

const STATUS_OPTIONS = ['Draft', 'Pending', 'Paid', 'Overdue'] as const;

const makeEmptyItem = (): InvoiceItemInput => ({
    description: '',
    quantity: 1,
    unit: '',
    unit_price: 0,
    amount: 0,
});

const InvoiceForm: React.FC<Props> = ({
                                          onSubmit, loading, mode = 'create', initialValues,
                                      }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [form, setForm] = useState<CreateInvoicePayload>(
        initialValues ?? {
            customer_uuid: '',
            invoice_number: '',
            issue_date: dayjs().format('YYYY-MM-DD'),
            due_date: dayjs().add(14, 'day').format('YYYY-MM-DD'),
            tax_rate: 0,
            subtotal: 0,
            tax_amount: 0,
            total: 0,
            status: 'Draft',
            notes: '',
            items: [makeEmptyItem()],
        },
    );

    /* totals */
    const recalcTotals = (items: InvoiceItemInput[], rate: number) => {
        const subtotal = items.reduce((s, i) => s + i.amount, 0);
        const tax_amount = +(subtotal * (rate / 100)).toFixed(2);
        const total = subtotal + tax_amount;
        return {subtotal, tax_amount, total};
    };
    const patch = (p: Partial<CreateInvoicePayload>) => {
        const next = {...form, ...p};
        setForm({...next, ...recalcTotals(next.items, next.tax_rate)});
    };

    /* customers */
    useEffect(() => {
        (async () => {
            const res = await getCustomers(1, 1000);
            setCustomers(res.data);
        })();
    }, []);

    /* handlers */
    const txt = (field: keyof CreateInvoicePayload) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            patch({[field]: e.target.value} as Partial<CreateInvoicePayload>);

    // Update dateChange to accept both value and context
    const dateChange = (field: keyof CreateInvoicePayload) =>
        (value: unknown,) => {
            // Only update if value is a Dayjs instance
            if (dayjs.isDayjs(value)) {
                patch({[field]: value.format('YYYY-MM-DD')} as Partial<CreateInvoicePayload>);
            } else if (value === null) {
                patch({[field]: ''} as Partial<CreateInvoicePayload>);
            }
        };

    const num = (field: keyof CreateInvoicePayload) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            patch({[field]: e.target.value === '' ? 0 : +e.target.value} as Partial<CreateInvoicePayload>);

    const itemChange = (
        idx: number,
        key: keyof InvoiceItemInput,
        val: string | number,
    ) => {
        const items = [...form.items];
        const updatedItems = items.map((item, i) => {
            if (i !== idx) return item;

            const updatedItem = {...item};
            if (key === 'quantity' || key === 'unit_price') {
                (updatedItem as any)[key] = +val;
            } else {
                (updatedItem as any)[key] = val;
            }

            updatedItem.amount = +(updatedItem.quantity * updatedItem.unit_price).toFixed(2);
            return updatedItem;
        });

        patch({items: updatedItems});
    };

    const addItem = () => patch({items: [...form.items, makeEmptyItem()]});
    const delItem = (i: number) =>
        patch({
            items: form.items.length > 1 ? form.items.filter((_, idx) => idx !== i) : [makeEmptyItem()],
        });

    /* submit */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    /* UI */
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h6" mb={2}>
                {mode === 'edit' ? 'Edit Invoice' : 'New Invoice'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* customer / invoice # */}
                    <Grid size={{xs: 12, md: 8}}>
                        <TextField
                            select
                            fullWidth
                            required
                            label="Customer"
                            value={form.customer_uuid}
                            onChange={txt('customer_uuid')}
                        >
                            {customers.map((c) => (
                                <MenuItem key={c.uuid} value={c.uuid}>
                                    {c.first_name} {c.last_name} ({c.email})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{xs: 12, md: 4}}>
                        <TextField
                            fullWidth
                            required
                            label="Invoice #"
                            value={form.invoice_number}
                            onChange={txt('invoice_number')}
                        />
                    </Grid>

                    {/* dates / tax / status */}
                    <Grid size={{xs: 6, md: 3}}>
                        <DatePicker
                            label="Issue Date"
                            value={dayjs(form.issue_date)}
                            onChange={dateChange('issue_date')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                    </Grid>
                    <Grid size={{xs: 6, md: 3}}>
                        <DatePicker
                            label="Due Date"
                            value={dayjs(form.due_date)}
                            onChange={dateChange('due_date')}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                    </Grid>
                    <Grid size={{xs: 6, md: 3}}>
                        <TextField
                            fullWidth
                            label="Tax Rate %"
                            type="number"
                            value={form.tax_rate || ''}
                            onChange={num('tax_rate')}
                            slotProps={{
                                htmlInput: {step: 0.01}
                            }}
                        />
                    </Grid>
                    <Grid size={{xs: 6, md: 3}}>
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            value={form.status}
                            onChange={txt('status')}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* items */}
                    <Grid size={{xs: 12}}>
                        <Typography variant="subtitle1" mt={2} mb={1}>
                            Items
                        </Typography>

                        {form.items.map((it, idx) => (
                            <Grid container spacing={1} key={idx} sx={{mb: 1}}>
                                <Grid size={{xs: 12, md: 4}}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={it.description}
                                        onChange={(e) => itemChange(idx, 'description', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{xs: 4, md: 2}}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Qty"
                                        value={it.quantity || ''}
                                        onChange={(e) => itemChange(idx, 'quantity', +e.target.value)}
                                        slotProps={{
                                            htmlInput: {step: 0.01}
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 4, md: 2}}>
                                    <TextField
                                        fullWidth
                                        label="Unit"
                                        value={it.unit}
                                        onChange={(e) => itemChange(idx, 'unit', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{xs: 4, md: 2}}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Unit Price"
                                        value={it.unit_price || ''}
                                        onChange={(e) => itemChange(idx, 'unit_price', +e.target.value)}
                                        slotProps={{
                                            htmlInput: {step: 0.01}
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 6, md: 1}}>
                                    <TextField disabled fullWidth label="Amount" value={it.amount.toFixed(2)}/>
                                </Grid>
                                <Grid size={{xs: 6, md: 1}} sx={{display: 'flex', alignItems: 'center'}}>
                                    <IconButton onClick={() => delItem(idx)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        <Button startIcon={<AddIcon/>} variant="outlined" size="small" onClick={addItem} sx={{mt: 1}}>
                            Add Item
                        </Button>
                    </Grid>

                    {/* notes / totals */}
                    <Grid size={{xs: 12, md: 8}}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label="Notes"
                            value={form.notes}
                            onChange={txt('notes')}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 4}}>
                        <Box sx={{p: 2, border: 1, borderColor: 'divider', borderRadius: 1, height: '100%'}}>
                            <Typography variant="body2">Subtotal: £{form.subtotal.toFixed(2)}</Typography>
                            <Typography variant="body2">Tax: £{form.tax_amount.toFixed(2)}</Typography>
                            <Typography variant="h6" fontWeight="bold">
                                Total: £{form.total.toFixed(2)}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* submit */}
                    <Grid size={{xs: 12}} sx={{textAlign: 'right', mt: 2}}>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Saving…' : mode === 'edit' ? 'Update Invoice' : 'Create Invoice'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default InvoiceForm;
