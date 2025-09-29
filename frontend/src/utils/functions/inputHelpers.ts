import { TFunction } from 'i18next';

export function getDefaultWhenNullOrUndefined(value: string | undefined | null, defaultValue: string = '') {
    if (value !== undefined && value !== null) {
        return value;
    }
    return defaultValue;
}

export function getDefaultWhenArrayNullOrUndefined<TEntity>(
    entities: TEntity[] | undefined,
    key: keyof TEntity,
    value: string | undefined | null,
    defaultValue: string = ''
) {
    if (value !== undefined && value !== null && entities !== undefined) {
        if (entities?.some((option) => option[key] === value)) {
            return value;
        }
    }
    return defaultValue;
}

export function getTranslateWhenNotNullOrUndefined(
    trans: TFunction<'translation', undefined>,
    value: string | undefined | null,
    isTranslatable: boolean | undefined = true,
    defaultValue: string = ''
) {
    if (isTranslatable && value !== undefined && value !== null) {
        return trans(value);
    }
    return defaultValue;
}

export function getShrinkStatus(value: any) {
    return !(value === undefined || value === null || value === '');
}

export function getErrorStatus(value: any) {
    return !(value === undefined || value === null || value === '');
}

export function hasMatchingKeys(errors: Record<string, any>, keysToCheck: string[]): boolean {
    const flatKeys = Object.keys(errors).map(
        (key) => key.replace(/\[\d+\]/g, '') // Remove [index] from keys
    );

    console.log('Flat Keys:', flatKeys);

    return flatKeys.some((flatKey) => keysToCheck.includes(flatKey));
}
