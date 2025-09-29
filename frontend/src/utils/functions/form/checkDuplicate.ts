/**
 * Checks if a duplicate exists in the array based on a specified key and value,
 * excluding the current index from the comparison.
 *
 * @param array - The array of items to check for duplicates.
 * @param key - The key to compare for duplicates.
 * @param value - The value to check for duplication.
 * @param index - The index to exclude from the duplicate check.
 * @returns boolean - Returns true if a duplicate exists, otherwise false.
 */
export const checkDuplicate = <T>(array: T[], key: keyof T, value: T[keyof T], index: number): boolean => {
    return array.some((item, idx) => item[key] === value && idx !== index);
};
