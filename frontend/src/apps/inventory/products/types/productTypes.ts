import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const ProductSchema = () =>
  dz.object({
    id: dz.optionalNumber(),
    name: dz.requiredString(),
    sku: dz.requiredString(),
    price: dz.requiredNumber(),
    stockQuantity: dz.requiredNumber(),
    description: dz.optionalString(),
    categoryId: dz.requiredNumber(),
    categoryName: dz.optionalString(),
    companyId: dz.requiredNumber(),
    companyName: dz.optionalString(),
    bikeModelId: dz.optionalNumber(),
    bikeModelName: dz.optionalString(),
    baseUnitId: dz.requiredNumber(),
    baseUnitName: dz.optionalString()
  });

export const productSchema = ProductSchema();
export type IProduct = z.infer<typeof productSchema>;

export const productSchemaInstance = (): IProduct => ({}) as IProduct;