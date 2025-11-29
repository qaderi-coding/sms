export interface ICustomer {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  is_base_currency: boolean;
  current_exchange_rate: number;
  last_updated: string; // ISO date string
  sales: any[]; // You can replace 'any' with proper type if known
  sale_items: any[];
  purchases: any[];
  purchase_items: any[];
  payments: any[];
  transactions: any[];
  exchange_rates: any[];
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface IPaymentStatus {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}
