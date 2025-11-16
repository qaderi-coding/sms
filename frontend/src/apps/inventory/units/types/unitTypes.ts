import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const UnitSchema = () =>
  dz.object({
    id: dz.optionalNumber(),
    name: dz.requiredString(),
    symbol: dz.requiredString()
  });

export const unitSchema = UnitSchema();
export type IUnit = z.infer<typeof unitSchema>;

export const unitSchemaInstance = (): IUnit => ({}) as IUnit;