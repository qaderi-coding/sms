import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'utils/axios';
import { Sale, SalesState, Customer, Product } from '../types';

// Async thunks
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async () => {
    const response = await axios.get('/api/sales/sales/');
    return response.data;
  }
);

export const fetchCustomers = createAsyncThunk(
  'sales/fetchCustomers',
  async () => {
    const response = await axios.get('/api/parties/customers/');
    return response.data;
  }
);

export const fetchProducts = createAsyncThunk(
  'sales/fetchProducts',
  async () => {
    const response = await axios.get('/api/inventory/products/');
    return response.data;
  }
);

export const createBulkSale = createAsyncThunk(
  'sales/createBulkSale',
  async (saleData: Omit<Sale, 'id'>) => {
    const response = await axios.post('/api/sales/bulk-create/', saleData);
    return response.data;
  }
);

export const updateBulkSale = createAsyncThunk(
  'sales/updateBulkSale',
  async ({ id, ...saleData }: Sale) => {
    const response = await axios.put(`/api/sales/bulk-update/${id}/`, saleData);
    return response.data;
  }
);

const initialState: SalesState = {
  sales: [],
  customers: [],
  products: [],
  loading: false,
  error: null,
  currentSale: null
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSale: (state, action: PayloadAction<Sale | null>) => {
      state.currentSale = action.payload;
    },
    clearCurrentSale: (state) => {
      state.currentSale = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.results || action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sales';
      })
      // Fetch customers
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload.results || action.payload;
      })
      // Fetch products
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.results || action.payload;
      })
      // Create bulk sale
      .addCase(createBulkSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBulkSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.unshift(action.payload);
        state.currentSale = null;
      })
      .addCase(createBulkSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create sale';
      })
      // Update bulk sale
      .addCase(updateBulkSale.fulfilled, (state, action) => {
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        state.currentSale = null;
      });
  }
});

export const { clearError, setCurrentSale, clearCurrentSale } = salesSlice.actions;
export default salesSlice.reducer;