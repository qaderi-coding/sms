import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import { gridSpacing } from 'config';
import InputLabel from 'components/@extended/InputLabel';
import { Product } from '../types';
import { AddInvoice } from 'types/invoice';

// ==============================|| CREATE SALE - SELECT PRODUCT ||============================== //

interface Props {
    handleAddItem: (item: AddInvoice) => void;
    setAddItemClicked: (item: boolean) => void;
    products: Product[]; // Pass products as prop instead of using loader
}

function SelectProduct({ handleAddItem, setAddItemClicked, products }: Props) {
    const [selectedItem, setSelectedItem] = useState<AddInvoice>();
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [amount, setAmount] = useState<number>(0);
    const [errors, setErrors] = useState({ quantityError: '' });

    useEffect(() => {
        if (selectedItem?.id) {
            setAmount(selectedItem?.offerPrice! * selectedQuantity);
        }
    }, [selectedQuantity, selectedItem]);

    const handleAddInvoiceItem = (event: any) => {
        const value = event.target.value;
        if (event.target.name === 'quantity') {
            if (Number(value) < 0) {
                setErrors({
                    ...errors,
                    quantityError: 'negative values not allowed'
                });
                setSelectedQuantity(value);
            } else if (Number(value) === 0) {
                setErrors({
                    ...errors,
                    quantityError: 'quantity can not be zero'
                });
                setSelectedQuantity(value);
            } else {
                setSelectedQuantity(value);
                setErrors({
                    ...errors,
                    quantityError: ''
                });
            }
        } else {
            const product = products.find((item) => item.id === Number(value));
            if (product) {
                setSelectedItem({
                    id: product.id,
                    name: product.name,
                    description: product.name,
                    offerPrice: product.price
                });
            }
        }
    };

    const handleOnAddItem = () => {
        const data = {
            ...selectedItem,
            totalAmount: amount,
            selectedQuantity
        };

        handleAddItem(data as AddInvoice);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                    <InputLabel sx={{ color: 'grey.500', fontWeight: '400' }}>Item Name</InputLabel>
                    <FormControl>
                        <Select
                            fullWidth
                            displayEmpty
                            value={selectedItem?.id || ''}
                            onChange={handleAddInvoiceItem}
                            input={<OutlinedInput />}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem disabled value="">
                                <Typography color="textSecondary">Select Item</Typography>
                            </MenuItem>
                            {products.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                        <Typography variant="subtitle1">{item.name}</Typography>
                                        <Typography>Rate : ${item.price}</Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                    <InputLabel sx={{ color: 'grey.500', fontWeight: '400' }}>Quantity</InputLabel>
                    <TextField
                        fullWidth
                        type="number"
                        name="quantity"
                        value={selectedQuantity}
                        onChange={handleAddInvoiceItem}
                        error={Boolean(errors.quantityError)}
                        helperText={errors.quantityError}
                        disabled={!selectedItem?.id}
                    />
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                    <InputLabel sx={{ color: 'grey.500', fontWeight: '400' }}>Amount</InputLabel>
                    <TextField fullWidth name="amount" value={Math.round(amount * 100) / 100} disabled />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    <Button color="error" onClick={() => setAddItemClicked(false)}>
                        Cancel
                    </Button>
                    <Button disabled={!selectedItem?.id || !selectedQuantity} variant="contained" size="small" onClick={handleOnAddItem}>
                        Add
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

export default SelectProduct;