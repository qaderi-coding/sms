import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const BikeModelSchema = () =>
  dz.object({
    id: dz.optionalNumber(),
    companyId: dz.requiredNumber(),
    companyName: dz.optionalString(),
    name: dz.requiredString(),
    description: dz.optionalString()
  });

export const bikeModelSchema = BikeModelSchema();
export type IBikeModel = z.infer<typeof bikeModelSchema>;

export const bikeModelSchemaInstance = (): IBikeModel => ({}) as IBikeModel;