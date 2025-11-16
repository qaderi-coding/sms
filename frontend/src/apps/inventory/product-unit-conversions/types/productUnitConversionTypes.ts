import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const ProductUnitConversionSchema = () =>
  dz.object({
    id: dz.optionalNumber(),
    productId: dz.requiredNumber(),
    productName: dz.optionalString(),
    unitId: dz.requiredNumber(),
    unitName: dz.optionalString(),
    factor: dz.requiredNumber()
  });

export const productUnitConversionSchema = ProductUnitConversionSchema();
export type IProductUnitConversion = z.infer<typeof productUnitConversionSchema>;

export const productUnitConversionSchemaInstance = (): IProductUnitConversion => ({}) as IProductUnitConversion;