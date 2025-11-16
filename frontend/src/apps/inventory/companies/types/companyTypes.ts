import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

const CompanySchema = () =>
  dz.object({
    id: dz.optionalNumber(),
    name: dz.requiredString(),
    country: dz.requiredString()
  });

export const companySchema = CompanySchema();
export type ICompany = z.infer<typeof companySchema>;

export const companySchemaInstance = (): ICompany => ({}) as ICompany;