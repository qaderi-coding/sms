import { z } from 'zod';

export class ValidationErrors extends Error {
    public name = 'ValidationErrors';
    public inner: Array<{ path: string; message: string }> = [];

    public constructor(message: string) {
        super(message);
    }
}

function createZodErrors(e: z.ZodError) {
    const validationErrors = new ValidationErrors(e.message);
    validationErrors.inner = e.errors.map((error) => {
        return { path: error.path.join('.'), message: error.message };
    });

    return validationErrors;
}

export function getZodValidationSchema<T>(schema: z.ZodSchema<T>, params?: Partial<z.ParseParams>) {
    return {
        async validate(obj: T) {
            try {
                await schema.parseAsync(obj, params);
            } catch (err: unknown) {
                throw createZodErrors(err as z.ZodError<T>);
            }
        }
    };
}

function highlightErrorTab(errors: object) {
    if (Object.keys(errors).length > 0) {
        const tabId = document
            .querySelector(`[name="${Object.keys(errors)[0]}"]`)
            ?.closest(`[role="tabpanel"]`)
            ?.attributes.getNamedItem('aria-labelledby')?.value;
        if (tabId) (document.querySelector(`#${tabId}`) as HTMLAnchorElement)?.click();
    }
}

export function setZodErrorAtPath<T extends object>(obj: T, path: (string | number)[], value: any): T {
    const keys: (string | number)[] = path;
    let current: any = obj;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof key === 'string') {
            if (i < keys.length - 1) {
                if (!(current[key] instanceof Object)) current[key] = {};
            }
            if (i === keys.length - 1) current[key] = value;
        } else {
            if (i < keys.length - 1) {
                if (!(current instanceof Array)) current[key] = [];
            }
            if (i === keys.length - 1) current[key] = value;
        }
        current = current[key];
    }
    return obj;
}

function getZodValidationsResult(error: z.ZodError) {
    let result: Record<string, string> = {};

    error.errors.forEach((error) => {
        let paths = error.path.reduce((previousValue, currentValue, currentIndex) => {
            if (typeof currentValue === 'number') {
                previousValue.push(`${previousValue.pop()}[${currentValue}]`);
            } else {
                previousValue.push(currentValue);
            }
            return previousValue;
        }, [] as string[]);
        result[paths.join('.')] = error.message;
    });

    let validationErrorsObject: Record<string, string> = {};

    error.errors.forEach((error) => {
        setZodErrorAtPath(validationErrorsObject, error.path as any, error.message);
    });

    return result;
}

export function applyZodValidations<T>(schema: z.ZodSchema<T>, params?: Partial<z.ParseParams>) {
    return applyZodValidationsWithDebugging<T>(schema, params);
    return async (values: T) => {
        const result = await schema.safeParseAsync(values, params);
        if (!result.success) {
            let errors = getZodValidationsResult(result.error);
            return errors;
        }
    };
}

export function applyZodValidationsWithDebugging<T>(schema: z.ZodSchema<T>, params?: Partial<z.ParseParams>) {
    return async (values: T) => {
        const result = await schema.safeParseAsync(values, params);
        if (!result.success) {
            const errors = getZodValidationsResult(result.error);
            console.log('Zod Validation Errors', errors);
            return errors;
        }
    };
}
