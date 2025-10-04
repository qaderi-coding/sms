export function isNullOrEmptyObject(obj: object | null | undefined): boolean {
    return obj == null || (typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length === 0);
}
