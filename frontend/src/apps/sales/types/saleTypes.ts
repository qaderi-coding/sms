import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const SaleItemSchema = () =>
  dz.object({
    itemId: dz.requiredNumber(),
    qty: dz.requiredNumber(),
    price: dz.requiredNumber(),
    total: dz.requiredNumber()
  });

const SaleSchema = () =>
  dz.object({
    customerId: dz.requiredNumber(),
    date: dz.requiredString(), // "2025-01-20T00:00:00"
    cashReceived: dz.requiredNumber(),
    currencyId: dz.requiredNumber(),
    notes: dz.optionalString(),
    items: z.array(SaleItemSchema())
  });

export const saleItemSchema = SaleItemSchema();
export const saleSchema = SaleSchema();

export type ISaleItem = z.infer<typeof saleItemSchema>;
export type ISale = z.infer<typeof saleSchema>;

export const saleSchemaInstance = (): ISale =>
  ({
    date: new Date().toISOString(),
    cashReceived: 0,
    notes: '',
    items: []
  }) as ISale;
