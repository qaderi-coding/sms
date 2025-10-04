import { ZodObject } from 'zod';

export interface IValidator {
    Validations(): ZodObject<any>;
}

export function implementsValidator() {
    return <U extends IValidator>(constructor: U) => {};
}