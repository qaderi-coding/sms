export { default as CreateCustomer } from './views/CreateCustomer';
export { default as CustomerList } from './views/CustomerList';
export { default as CustomerManagement } from './views/CustomerManagement';
export { default as CustomerInfo } from './components/CustomerInfo';
export { CustomerActions } from './redux/CustomerSlice';
export type { ICustomer } from './redux/CustomerTypes';
export { useCustomerData } from './hook/useCustomerData';