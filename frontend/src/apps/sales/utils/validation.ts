import { z } from 'zod';

export const saleItemSchema = z.object({
  product: z.number().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Unit price must be positive'),
  total_price: z.number().min(0, 'Total price must be positive')
});

export const saleSchema = z.object({
  customer: z.number().min(1, 'Customer is required'),
  sale_date: z.string().min(1, 'Sale date is required'),
  discount: z.number().min(0, 'Discount must be positive').default(0),
  payment_status: z.enum(['PENDING', 'PARTIAL', 'PAID']).default('PENDING'),
  notes: z.string().default(''),
  items: z.array(saleItemSchema).min(1, 'At least one item is required')
});

export type SaleFormData = z.infer<typeof saleSchema>;
export type SaleItemFormData = z.infer<typeof saleItemSchema>;