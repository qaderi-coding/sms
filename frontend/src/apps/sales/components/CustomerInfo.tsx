import { useEffect, useState } from 'react';

// material-ui
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// project imports
import { useDispatch, useSelector } from 'store';
import { fetchCustomers } from '../store/salesSlice';
import { Customer } from '../types';

// assets
import AddIcon from '@mui/icons-material/Add';

interface ClientInfoProps {
    formik: any;
    customers: Customer[];
    handleOnSelectValue: (value: Customer) => void;
}

// ==============================|| CUSTOMER INFO ||============================== //

const CustomerInfo = ({ formik, customers, handleOnSelectValue }: ClientInfoProps) => {
    const [data, setData] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [valueBasic, setValueBasic] = useState<Date | null>(new Date());
    const dispatch = useDispatch();

    const handleDialogToggler = () => {
        setOpen(!open);
    };

    const handleSelectCustomer = (e: SelectChangeEvent) => {
        setData(e.target.value);
        const customerId = e.target.value;
        if (customerId) {
            const customer = customers.find(c => c.id === Number(customerId));
            if (customer) {
                handleOnSelectValue(customer);
            }
        }
    };

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    return (
        <>
            <Grid item xs={12} md={4}>
                <Stack>
                    <InputLabel required sx={{ color: 'grey.500', fontWeight: '400' }}>
                        Invoice Number
                    </InputLabel>
                    <TextField
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={formik.values.invoiceNumber}
                        onBlur={formik.handleBlur}
                        error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
                        helperText={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
                        onChange={formik.handleChange}
                        fullWidth
                        placeholder="Invoice #"
                    />
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack>
                    <InputLabel id="demo-simple-select-label">Select Customer</InputLabel>
                    <Select
                        endAdornment={
                            <InputAdornment position="end">
                                <Button onClick={handleDialogToggler} startIcon={<AddIcon />}>
                                    New customer
                                </Button>
                            </InputAdornment>
                        }
                        defaultValue=""
                        sx={{ '& .MuiSelect-icon': { right: 120 } }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Customer"
                        onChange={handleSelectCustomer}
                        value={data}
                    >
                        <MenuItem value="">Select Customer</MenuItem>
                        {customers.map((customer) => (
                            <MenuItem value={customer.id} onClick={() => handleOnSelectValue(customer)} key={customer.id}>
                                {customer.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack>
                    <InputLabel required>Customer Name</InputLabel>
                    <TextField
                        fullWidth
                        id="customerName"
                        name="customerName"
                        value={formik.values.customerName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                        helperText={formik.touched.customerName && formik.errors.customerName}
                        placeholder="Alex Z."
                    />
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack>
                    <InputLabel required>Customer Email</InputLabel>
                    <TextField
                        type="email"
                        fullWidth
                        id="customerEmail"
                        name="customerEmail"
                        value={formik.values.customerEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.customerEmail && Boolean(formik.errors.customerEmail)}
                        helperText={formik.touched.customerEmail && formik.errors.customerEmail}
                        placeholder="alex@company.com"
                    />
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack>
                    <InputLabel required>Customer Contact Number</InputLabel>
                    <TextField
                        fullWidth
                        id="customerPhone"
                        name="customerPhone"
                        value={formik.values.customerPhone}
                        onBlur={formik.handleBlur}
                        error={formik.touched.customerPhone && Boolean(formik.errors.customerPhone)}
                        helperText={formik.touched.customerPhone && formik.errors.customerPhone}
                        onChange={formik.handleChange}
                        placeholder="+ 00 00000 00000"
                    />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack>
                    <InputLabel required>Customer Address</InputLabel>
                    <TextField
                        fullWidth
                        id="customerAddress"
                        name="customerAddress"
                        value={formik.values.customerAddress}
                        onBlur={formik.handleBlur}
                        error={formik.touched.customerAddress && Boolean(formik.errors.customerAddress)}
                        helperText={formik.touched.customerAddress && formik.errors.customerAddress}
                        onChange={formik.handleChange}
                        multiline
                        placeholder="Enter Address"
                    />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack>
                    <InputLabel required>Invoice Date</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { fullWidth: true } }}
                            value={valueBasic}
                            onChange={(newValue: Date | null) => {
                                setValueBasic(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack>
                    <InputLabel required>Status</InputLabel>
                    <Select
                        id="orderStatus"
                        name="orderStatus"
                        defaultValue={formik.values.orderStatus}
                        value={formik.values.orderStatus}
                        onChange={formik.handleChange}
                    >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="PARTIAL">Partial</MenuItem>
                        <MenuItem value="PAID">Paid</MenuItem>
                    </Select>
                    {formik.errors.orderStatus && <FormHelperText error>{formik.errors.orderStatus}</FormHelperText>}
                </Stack>
            </Grid>
            <Dialog open={open} onClose={handleDialogToggler} sx={{ '& .MuiDialog-paper': { maxWidth: '100%', width: 980 } }}>
                {/* AddCustomer component would go here - for now just show a placeholder */}
                {open && (
                    <div>
                        <h3>Add New Customer</h3>
                        <p>Add customer form would go here</p>
                        <Button onClick={handleDialogToggler}>Close</Button>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default CustomerInfo;