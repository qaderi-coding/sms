# Customer Feature

This customer feature follows the Redux Toolkit feature-based structure pattern, similar to the createDocument sample.

## Structure

```
customer/
├── components/
│   └── CustomerInfo.tsx          # Customer form fields component
├── hook/
│   └── useCustomerData.ts        # Custom hook for customer data operations
├── redux/
│   ├── CustomerTypes.ts          # Type definitions and validation schemas
│   └── CustomerSlice.ts          # Redux slice with CRUD actions
├── views/
│   ├── CreateCustomer.tsx        # Create/Edit customer form view
│   ├── CustomerList.tsx          # Customer list with edit/delete actions
│   ├── CustomerManagement.tsx    # Combined management view with tabs
│   └── CustomerFormWrapper.tsx   # Form wrapper component
└── index.ts                      # Export all components and utilities
```

## Features

- **CRUD Operations**: Create, Read, Update, Delete customers
- **Form Validation**: Zod schema validation with Formik
- **Custom Formik Components**: Uses existing custom formik components
- **Redux State Management**: Centralized state with Redux Toolkit
- **TypeScript Support**: Full type safety
- **Responsive UI**: Material-UI components

## API Endpoints

The feature expects these .NET Core API endpoints:

- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

## Usage

```tsx
import { CustomerManagement } from 'apps/parties/customer';

// Use the complete management interface
<CustomerManagement />

// Or use individual components
import { CreateCustomer, CustomerList } from 'apps/parties/customer';
```

## Custom Formik Components Used

- FormikTextField
- FormikCheckboxField
- Uses PropsGenerator for consistent prop generation