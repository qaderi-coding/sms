import axios from 'utils/axios';

// Shop Management API endpoints
export const shopAPI = {
  // Companies
  companies: {
    getAll: () => axios.get('/api/inventory/companies'),
    getById: (id) => axios.get(`/api/inventory/companies/${id}`),
    create: (data) => axios.post('/api/inventory/companies', data),
    update: (id, data) => axios.put(`/api/inventory/companies/${id}`, data),
    delete: (id) => axios.delete(`/api/inventory/companies/${id}`)
  },

  // Products
  products: {
    getAll: () => axios.get('/api/inventory/products'),
    getById: (id) => axios.get(`/api/inventory/products/${id}`),
    create: (data) => axios.post('/api/inventory/products', data),
    update: (id, data) => axios.put(`/api/inventory/products/${id}`, data),
    delete: (id) => axios.delete(`/api/inventory/products/${id}`)
  },

  // Customers
  customers: {
    getAll: () => axios.get('/api/parties/customers'),
    getById: (id) => axios.get(`/api/parties/customers/${id}`),
    create: (data) => axios.post('/api/parties/customers', data),
    update: (id, data) => axios.put(`/api/parties/customers/${id}`, data),
    delete: (id) => axios.delete(`/api/parties/customers/${id}`)
  },

  // Suppliers
  suppliers: {
    getAll: () => axios.get('/api/parties/suppliers'),
    getById: (id) => axios.get(`/api/parties/suppliers/${id}`),
    create: (data) => axios.post('/api/parties/suppliers', data),
    update: (id, data) => axios.put(`/api/parties/suppliers/${id}`, data),
    delete: (id) => axios.delete(`/api/parties/suppliers/${id}`)
  },

  // Categories
  categories: {
    getAll: () => axios.get('/api/inventory/categories'),
    getById: (id) => axios.get(`/api/inventory/categories/${id}`),
    create: (data) => axios.post('/api/inventory/categories', data),
    update: (id, data) => axios.put(`/api/inventory/categories/${id}`, data),
    delete: (id) => axios.delete(`/api/inventory/categories/${id}`)
  },

  // Sales
  sales: {
    getAll: () => axios.get('/api/sales'),
    getById: (id) => axios.get(`/api/sales/${id}`),
    createBulk: (data) => axios.post('/api/sales/bulk-create', data),
    updateBulk: (id, data) => axios.put(`/api/sales/bulk-update/${id}`, data),
    createReturn: (data) => axios.post('/api/sales/returns/bulk-create', data)
  },

  // Purchases
  purchases: {
    getAll: () => axios.get('/api/purchases'),
    getById: (id) => axios.get(`/api/purchases/${id}`),
    createBulk: (data) => axios.post('/api/purchases/bulk-create', data),
    updateBulk: (id, data) => axios.put(`/api/purchases/bulk-update/${id}`, data),
    createReturn: (data) => axios.post('/api/purchases/returns/bulk-create', data),
    delete: (id) => axios.delete(`/api/purchases/${id}`)
  },

  // Expenses
  expenses: {
    getAll: () => axios.get('/api/expenses'),
    getById: (id) => axios.get(`/api/expenses/${id}`),
    create: (data) => axios.post('/api/expenses', data),
    update: (id, data) => axios.put(`/api/expenses/${id}`, data),
    delete: (id) => axios.delete(`/api/expenses/${id}`)
  },

  // Payments
  payments: {
    getAll: () => axios.get('/api/payments'),
    getById: (id) => axios.get(`/api/payments/${id}`),
    receive: (data) => axios.post('/api/payments/receive', data),
    make: (data) => axios.post('/api/payments/make', data),
    update: (id, data) => axios.put(`/api/payments/${id}`, data),
    delete: (id) => axios.delete(`/api/payments/${id}`)
  },

  // Loans
  loans: {
    getAll: () => axios.get('/api/loans'),
    getById: (id) => axios.get(`/api/loans/${id}`),
    give: (data) => axios.post('/api/loans/give', data),
    receive: (data) => axios.post('/api/loans/receive', data),
    close: (id) => axios.put(`/api/loans/${id}/close`),
    delete: (id) => axios.delete(`/api/loans/${id}`)
  },

  // Units
  units: {
    getAll: () => axios.get('/api/inventory/units'),
    getById: (id) => axios.get(`/api/inventory/units/${id}`),
    create: (data) => axios.post('/api/inventory/units', data),
    update: (id, data) => axios.put(`/api/inventory/units/${id}`, data),
    delete: (id) => axios.delete(`/api/inventory/units/${id}`)
  },

  // Seed data
  seed: {
    all: () => axios.post('/api/seed/all'),
    reset: () => axios.post('/api/seed/reset')
  }
};

export default shopAPI;