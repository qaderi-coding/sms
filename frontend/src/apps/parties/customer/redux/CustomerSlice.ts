import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestApi } from 'utils/functions/requestApi';
import { createApiGetAction, createApiPostAction } from 'store/createApiAction';
import { ICustomer, GetCustomerInstance } from './CustomerTypes';

type CustomerState = {
  customers: ICustomer[];
  customer: ICustomer;
  loading: boolean;
  error: string | null;
};

const initialState: CustomerState = {
  customers: [],
  customer: GetCustomerInstance(),
  loading: false,
  error: null
};

export const CustomerSlice = createSlice({
  name: 'Customer',
  initialState,
  reducers: {
    setCustomers(state, action: PayloadAction<ICustomer[]>) {
      state.customers = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCustomer(state, action: PayloadAction<ICustomer>) {
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
    createCustomer(state, action: PayloadAction<ICustomer>) {
      state.customers.unshift(action.payload);
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateCustomer(state, action: PayloadAction<ICustomer>) {
      const index = state.customers.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
    deleteCustomer(state, action: PayloadAction<number>) {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearCustomer(state) {
      state.customer = GetCustomerInstance();
      state.loading = false;
      state.error = null;
    }
  }
});

const reduxActions = CustomerSlice.actions;

export const CustomerActions = {
  getAll() {
    return createApiGetAction<ICustomer[]>(requestApi.get('api/customers'), reduxActions.setCustomers, undefined, reduxActions.setLoading);
  },

  getById(id: number) {
    return createApiGetAction<ICustomer>(
      requestApi.get(`api/customers/${id}`),
      reduxActions.setCustomer,
      undefined,
      reduxActions.setLoading
    );
  },

  create(values: ICustomer, setErrors: any) {
    return createApiPostAction<ICustomer>(
      requestApi.post('api/customers', values),
      reduxActions.createCustomer,
      setErrors,
      reduxActions.setLoading
    );
  },

  update(values: ICustomer, setErrors: any) {
    return createApiPostAction<ICustomer>(
      requestApi.put(`api/customers/${values.id}`, values),
      reduxActions.updateCustomer,
      setErrors,
      reduxActions.setLoading
    );
  },

  delete(id: number) {
    return createApiPostAction(requestApi.delete(`api/customers/${id}`), () => reduxActions.deleteCustomer(id));
  }

  //   clear() {
  //     return (dispatch: useDispatch) => {
  //       dispatch(reduxActions.clearCustomer());
  //     };
  //   }
};
