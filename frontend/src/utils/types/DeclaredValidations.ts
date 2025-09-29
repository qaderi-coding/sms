import { appI18next, appZod } from '../../i18n';
import { z, ZodTypeAny } from 'zod';

const trans = (word: string) => appI18next.t(word);
const nullToUndefined = (value: any) => (value == null || value == 'null' ? undefined : value);
const isValidDate = (value: any) => !isNaN(new Date(value).getTime());
const isValidDateOrDefault = (value: any) => {
    if (value === undefined) return true;
    return !isNaN(new Date(value).getTime());
};

const phoneRegex = /^(\+93|0)\s?7([0-9]{2})\s?([0-9]{3})\s?([0-9]{3})$/;

let validations = {
    object: <T extends appZod.ZodRawShape>(params: T) => {
        return appZod.object<T>(params);
    },
    optionalObject: <T extends appZod.ZodRawShape>(params: T) => {
        return appZod.object<T>(params).optional();
    },
    array: <T extends ZodTypeAny>(schema: T) => {
        return appZod.array(schema);
    },
    requiredString: (message: any = trans('requiredString')) => {
        return appZod.string(message).trim().min(1, message);
    },
    requiredId: (message: any = trans('requiredId')) => {
        return appZod.coerce.number({ message }).gt(0, message);
    },
    requiredNumber: (message: any = trans('requiredNumber')) => {
        return appZod.coerce.number({ message }).min(1, message);
    },
    requiredPositiveNumber: (message: any = trans('requiredPositiveNumber')) => {
        return appZod.coerce.number({ message }).min(0, message).positive(message);
    },
    requiredNegativeNumber: (message: any = trans('requiredNegativeNumber')) => {
        return appZod.coerce.number({ message }).min(0, message).negative(message);
    },
    requiredDate: (message: any = trans('requiredDate')) => {
        return appZod.string(message).refine(isValidDate, { message: message });
    },
    requiredEmail: (message: any = trans('requiredEmail')) => {
        return appZod.string(message).email(message);
    },
    requiredYear: (message: any = trans('requiredYear')) => {
        return appZod.coerce.number({ message }).gt(1000).lt(3000);
    },
    requiredPhone: (message: any = trans('requiredPhone')) => {
        return appZod.string(message).regex(phoneRegex, message);
    },

    // optional section
    optionalString: (message: any = trans('optionalString')) => {
        return appZod.coerce.string().transform(nullToUndefined).optional();
    },
    optionalId: (message: any = trans('optionalId')) => {
        return appZod.coerce.number({ message }).transform(nullToUndefined).optional();
    },
    optionalNumber: (message: any = trans('optionalNumber')) => {
        return appZod.coerce.number({ message }).transform(nullToUndefined).optional();
    },
    optionalPositiveNumber: (message: any = trans('optionalPositiveNumber')) => {
        return appZod.coerce.number({ message }).positive(message).transform(nullToUndefined).optional();
    },
    optionalNegativeNumber: (message: any = trans('optionalNegativeNumber')) => {
        return appZod.coerce.number({ message }).negative(message).transform(nullToUndefined).optional();
    },
    optionalDate: (message: any = trans('optionalDate')) => {
        return z.coerce.string().optional().transform(nullToUndefined).refine(isValidDateOrDefault, { message: message });
    },
    optionalYear: (message: any = trans('optionalYear')) => {
        return appZod.coerce.number({ message }).gt(1000).lt(3000).transform(nullToUndefined).optional();
    },
    optionalPhone: (message: any = trans('optionalPhone')) => {
        return appZod.string(message).regex(phoneRegex, message).transform(nullToUndefined).optional();
    },
    optionalBoolean: () => {
        return appZod.coerce.boolean().transform(nullToUndefined).optional();
    }
};

export const dz = validations;

