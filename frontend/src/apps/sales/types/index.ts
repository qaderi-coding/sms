export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  category: {
    id: number;
    name: string;
  };
}

export interface SaleItem {
  id?: number;
  product: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Sale {
  id?: number;
  customer: number;
  customer_name?: string;
  sale_date: string;
  total_amount: number;
  discount: number;
  final_amount: number;
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID';
  notes: string;
  items: SaleItem[];
}

export interface SalesState {
  sales: Sale[];
  customers: Customer[];
  products: Product[];
  loading: boolean;
  error: string | null;
  currentSale: Sale | null;
}