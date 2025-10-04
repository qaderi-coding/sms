import { z, ZodTypeAny } from 'zod';

// const trans = (word: string) => appI18next.t(word);
const nullToUndefined = (value: any) => (value == null || value == 'null' ? undefined : value);
const isValidDate = (value: any) => !isNaN(new Date(value).getTime());
const isValidDateOrDefault = (value: any) => {
  if (value === undefined) return true;
  return !isNaN(new Date(value).getTime());
};

const phoneRegex = /^(\+93|0)\s?7([0-9]{2})\s?([0-9]{3})\s?([0-9]{3})$/;

let validations = {
  object: <T extends z.ZodRawShape>(params: T) => {
    return z.object<T>(params);
  },
  optionalObject: <T extends z.ZodRawShape>(params: T) => {
    return z.object<T>(params).optional();
  },
  array: <T extends ZodTypeAny>(schema: T) => {
    return z.array(schema);
  },
  requiredString: (message: any = 'requiredString') => {
    return z.string(message).trim().min(1, message);
  },
  requiredId: (message: any = 'requiredId') => {
    return z.coerce.number({ message }).gt(0, message);
  },
  requiredNumber: (message: any = 'requiredNumber') => {
    return z.coerce.number({ message }).min(1, message);
  },
  requiredPositiveNumber: (message: any = 'requiredPositiveNumber') => {
    return z.coerce.number({ message }).min(0, message).positive(message);
  },
  requiredNegativeNumber: (message: any = 'requiredNegativeNumber') => {
    return z.coerce.number({ message }).min(0, message).negative(message);
  },
  requiredDate: (message: any = 'requiredDate') => {
    return z.string(message).refine(isValidDate, { message: message });
  },
  requiredEmail: (message: any = 'requiredEmail') => {
    return z.string(message).email(message);
  },
  requiredYear: (message: any = 'requiredYear') => {
    return z.coerce.number({ message }).gt(1000).lt(3000);
  },
  requiredPhone: (message: any = 'requiredPhone') => {
    return z.string(message).regex(phoneRegex, message);
  },

  // optional section
  optionalString: (message: any = 'optionalString') => {
    return z.coerce.string().transform(nullToUndefined).optional();
  },
  optionalId: (message: any = 'optionalId') => {
    return z.coerce.number({ message }).transform(nullToUndefined).optional();
  },
  optionalNumber: (message: any = 'optionalNumber') => {
    return z.coerce.number({ message }).transform(nullToUndefined).optional();
  },
  optionalPositiveNumber: (message: any = 'optionalPositiveNumber') => {
    return z.coerce.number({ message }).positive(message).transform(nullToUndefined).optional();
  },
  optionalNegativeNumber: (message: any = 'optionalNegativeNumber') => {
    return z.coerce.number({ message }).negative(message).transform(nullToUndefined).optional();
  },
  optionalDate: (message: any = 'optionalDate') => {
    return z.coerce.string().optional().transform(nullToUndefined).refine(isValidDateOrDefault, { message: message });
  },
  optionalYear: (message: any = 'optionalYear') => {
    return z.coerce.number({ message }).gt(1000).lt(3000).transform(nullToUndefined).optional();
  },
  optionalPhone: (message: any = 'optionalPhone') => {
    return z.string(message).regex(phoneRegex, message).transform(nullToUndefined).optional();
  },
  optionalBoolean: () => {
    return z.coerce.boolean().transform(nullToUndefined).optional();
  }
};

export const dz = validations;
