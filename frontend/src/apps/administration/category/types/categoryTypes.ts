import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const CategorySchema = () =>
  dz.object({
    id: dz.optionalNumber(),
    name: dz.requiredString(),
    description: dz.optionalString(),
    created_at: dz.optionalString(),
    updated_at: dz.optionalString()
  });

export const categorySchema = CategorySchema();
export type ICategory = z.infer<typeof categorySchema>;

export const categorySchemaInstance = (): ICategory => ({}) as ICategory;
