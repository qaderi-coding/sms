import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

// material-ui
import {
  Grid,
  TextField,
  Button,
  Typography,
  Autocomplete,
  IconButton,
  FormControl,
  InputLabel as MuiInputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// third-party
import * as yup from 'yup';

// project imports
import { useDispatch, useSelector } from 'store';
import { fetchCustomers, fetchProducts, createBulkSale, updateBulkSale } from '../store/salesSlice';
import { saleSchema, SaleFormData } from '../utils/validation';
import { Sale, Product, Customer } from '../types';
import { InvoiceAmount, InvoiceItems, AddInvoice } from 'types/invoice';
import InputLabel from 'components/@extended/InputLabel';
import MainCard from 'components/MainCard';
import { gridSpacing } from 'config';

// new invoice components
import CustomerInfo from './CustomerInfo';
import ItemList from '../../saleViewTemplate/ItemList';
import AmountCard from '../../saleViewTemplate/AmountCard';
import SelectProduct from './SelectProduct';

interface SaleFormProps {
  sale?: Sale;
  onSuccess?: () => void;
}

// yup validation-schema - matching the invoice format
const validationSchema = yup.object({
  invoiceNumber: yup.string().required('Invoice Number is Required'),
  customerName: yup.string().required('Customer Name is Required'),
  customerEmail: yup.string().email('Enter a valid email').required('Customer Email is Required'),
  customerPhone: yup.string().min(10, 'Phone number should be of minimum 10 characters').required('Customer Phone is Required'),
  customerAddress: yup.string().required('Customer Address is Required'),
  orderStatus: yup.string().required('Order Status is required')
});

export default function SaleForm({ sale, onSuccess }: SaleFormProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customers, products, loading } = useSelector((state) => state.sales);
  
  const [allAmounts, setAllAmounts] = useState<InvoiceAmount>({
    subTotal: 0,
    appliedTaxValue: 0.1, // 10% tax
    appliedDiscountValue: 0.05, // 5% discount
    taxesAmount: 0,
    discountAmount: 0,
    totalAmount: 0
  });
  const [productsData, setProductsData] = useState<InvoiceItems[]>([]);
  const [addItemClicked, setAddItemClicked] = useState<boolean>(true);
  const [customerInfo, setCustomerInfo] = useState<Customer | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Initialize form with existing sale data if editing
  useEffect(() => {
    if (sale) {
      // Convert existing sale items to invoice items format
      const invoiceItems: InvoiceItems[] = sale.items.map((item, index) => ({
        id: item.id,
        product: products.find(p => p.id === item.product)?.name,
        description: products.find(p => p.id === item.product)?.name,
        quantity: item.quantity,
        amount: item.unit_price,
        total: item.total_price
      }));
      setProductsData(invoiceItems);

      // Set customer info
      const customer = customers.find(c => c.id === sale.customer);
      if (customer) {
        setCustomerInfo(customer);
      }
    }
  }, [sale, customers, products]);

  // Calculate amounts when productsData changes
  useEffect(() => {
    const amounts = {
      subTotal: 0,
      appliedTaxValue: 0.1, // 10% tax
      appliedDiscountValue: 0.05, // 5% discount - note: this should match your business logic
      taxesAmount: 0,
      discountAmount: 0,
      totalAmount: 0
    };
    
    productsData.forEach((item) => {
      amounts.subTotal += item.total as number;
    });
    
    amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
    amounts.discountAmount = (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
    amounts.totalAmount = amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
    
    setAllAmounts(amounts);
  }, [productsData]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      invoiceNumber: sale?.id ? `#${sale.id}` : '#INV001',
      customerName: customerInfo ? customerInfo.name : '',
      customerEmail: customerInfo ? customerInfo.name + '@example.com' : '',
      customerPhone: customerInfo ? customerInfo.phone : '',
      customerAddress: customerInfo ? customerInfo.address : '',
      orderStatus: sale?.payment_status || 'PENDING'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Convert invoice format to sale format
        const saleItems = productsData.map(item => ({
          product: products.find(p => p.name === item.product)?.id || 0,
          quantity: item.quantity || 0,
          unit_price: item.amount || 0,
          total_price: item.total || 0
        }));

        // Calculate total amount from items
        const totalAmount = saleItems.reduce((sum, item) => sum + item.total_price, 0);
        
        const saleData: SaleFormData = {
          customer: customerInfo?.id || 0,
          sale_date: sale?.sale_date || new Date().toISOString().split('T')[0],
          discount: allAmounts.discountAmount, // This comes from our calculated amounts
          payment_status: values.orderStatus as 'PENDING' | 'PARTIAL' | 'PAID',
          notes: values.customerAddress || '',
          items: saleItems
        };

        if (sale?.id) {
          await dispatch(updateBulkSale({ id: sale.id, ...saleData }));
        } else {
          await dispatch(createBulkSale(saleData));
        }
        
        onSuccess?.();
      } catch (error) {
        console.error('Error saving sale:', error);
      }
    }
  });

  // Handle customer selection from CustomerInfo
  const handleOnSelectValue = (customer: Customer) => {
    setCustomerInfo(customer);
    formik.setValues({
      ...formik.values,
      customerName: customer.name,
      customerEmail: customer.name + '@example.com', // This can be improved based on actual email
      customerPhone: customer.phone,
      customerAddress: customer.address
    });
  };

  // Delete product from list
  const deleteProductHandler = (id: number) => {
    setProductsData(productsData.filter((item) => item.id !== id));
  };

  // Add item to list
  const handleAddItem = (addingData: AddInvoice) => {
    setProductsData([
      ...productsData,
      {
        id: addingData.id,
        product: addingData.name,
        description: addingData.description,
        quantity: addingData.selectedQuantity,
        amount: addingData.offerPrice,
        total: addingData.totalAmount
      }
    ]);

    setAddItemClicked(false);
  };

  return (
    <MainCard title={sale?.id ? "Edit Sale" : "Create New Sale"}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={gridSpacing}>
          {/* customer info */}
          <CustomerInfo {...{ formik, customers, handleOnSelectValue }} />

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* item list page */}
          {productsData.length > 0 && (
            <Grid item xs={12}>
              <ItemList {...{ productsData, deleteProductHandler }} />
            </Grid>
          )}

          {addItemClicked ? (
            <Grid item xs={12}>
              {/* select item page */}
              <SelectProduct {...{ handleAddItem, setAddItemClicked, products }} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Button variant="text" onClick={() => setAddItemClicked(true)}>
                + Add Item
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* total card */}
          <Grid item xs={12}>
            <AmountCard {...{ allAmounts }} />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel required>Terms and Condition:</InputLabel>
              <TextField
                fullWidth
                id="customerAddress"
                name="customerAddress"
                value={formik.values.customerAddress}
                onChange={formik.handleChange}
                multiline
                rows={3}
                placeholder="Enter terms and conditions..."
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              type="submit"
              disabled={loading}
            >
              {sale?.id ? 'Update Sale' : 'Add Sale'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}