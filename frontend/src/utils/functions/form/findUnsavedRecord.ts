type FindResult = [boolean, number]; // Define a tuple type to hold the flag and index

// Generic type for records, where T is the type of record and K is the key of the record
export function findUnsavedRecord<T extends Record<string, any>>(records: T[], key: string): FindResult {
    if (records?.length > 0) {
        const index = records?.findIndex((record) => record[key] === null || record[key] === 0 || record[key] == undefined);
        const hasUnsaved = index !== -1; // Flag to indicate if an unsaved record exists
        return [hasUnsaved, index]; // Returning the flag and index as a tuple
    }
    return [false, -1]; // Return false if no records exist
}
