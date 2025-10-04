import { dz } from 'utils/types/DeclaredValidations';
import * as z from 'zod';

export const CustomerValidation = z.object({
  id: dz.optionalNumber(),
  name: dz.requiredString(),
  email: dz.requiredEmail(),
  phone: dz.optionalString(),
  address: dz.optionalString(),
  city: dz.optionalString(),
  country: dz.optionalString(),
  isActive: dz.optionalBoolean(),
  createdAt: dz.optionalDate(),
  updatedAt: dz.optionalDate()
});

export type ICustomer = z.infer<typeof CustomerValidation>;

export const GetCustomerInstance = (): ICustomer =>
  ({
    name: '',
    isActive: true
  }) as ICustomer;
