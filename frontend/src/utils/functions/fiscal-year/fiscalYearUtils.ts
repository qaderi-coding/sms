/**
 * Converts a fiscal year value (string or number) to a "DD/MM" format.
 * The input should be a 4-digit string or number representing the day and month.
 * For example, "3009" will be converted to "30/09".
 * @param value - The fiscal year value to convert.
 * @returns A string in the "DD/MM" format.
 * @example
 * fiscalYearToDayMonthFormat("3009"); // returns "30/09"
 * fiscalYearToDayMonthFormat(3009);   // returns "30/09"
 */
export const formatFiscalYearToDayMonth = (value: any) => {
    const str = value.toString().padStart(4, '0'); // ensures length 4
    const day = str.slice(0, 2);
    const month = str.slice(2, 4);
    return `${day}/${month}`;
};

/**
 * Converts a fiscal year value (string) to a "DMM" format.
 * The input should be in the format "DD/MM" or "D/M".
 * For example, "30/09" will be converted to "3009".
 * @param value - The fiscal year value to convert.
 * @returns A string in the "DMM" format.
 * @example
 * fiscalYearToCharFormat("30/09"); // returns "3009"
 * fiscalYearToCharFormat("3/9");   // returns "0309"
 */
export const formatFiscalYearToChar = (value: any) => {
    if (!value) return '0'; // or handle empty as you want

    const parts = value.split('/');
    if (parts.length !== 2) return '0'; // invalid format fallback

    // Remove leading zero from day
    const day = parts[0].replace(/^0+/, '') || '0';
    // Keep month with leading zero (to always have two digits)
    const month = parts[1].padStart(2, '0').slice(0, 2);

    return `${day}${month}`;
};

/**
 * Adds 12 months to a fiscal year value (string or number) and adjusts the day accordingly.
 * The input should be a 4-digit string or number representing the day and month.
 * For example, "3009" will be adjusted to "2910" after adding 12 months.
 * @param startValue - The fiscal year value to adjust.
 * @returns A string in the "DDMM" format after adding 12 months.
 * @example
 * addingMonths("3009"); // returns "2910"
 * addingMonths(3009);   // returns "2910"
 */
export const addingMonths = (startValue: any) => {
    const str = startValue.toString().padStart(4, '0');
    let day = parseInt(str.slice(0, 2), 10);
    let month = parseInt(str.slice(2, 4), 10);

    // Subtract 1 day
    day -= 1;
    if (day < 1) {
        month -= 1;
        if (month < 1) month = 12;

        if (month >= 1 && month <= 6) day = 31;
        else if (month >= 7 && month <= 11) day = 30;
        else if (month === 12) day = 29;
    }

    // Add 12 months
    month += 12;
    if (month > 12) {
        month = month % 12;
        if (month === 0) month = 12;
    }

    // Clamp day to max day for new month
    let maxDay = 31;
    if (month >= 1 && month <= 6) maxDay = 31;
    else if (month >= 7 && month <= 11) maxDay = 30;
    else if (month === 12) maxDay = 29;

    if (day > maxDay) day = maxDay;

    // Return as 4-char string "DDMM"
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    return `${dayStr}${monthStr}`;
};

/**
 * Formats fiscal years to a "DD/MM" format for both start and end dates.
 * @param fiscalYears - An array of fiscal year objects.
 * @returns An array of fiscal year objects with formatted start and end dates.
 * @example
 * const formattedFiscalYears = formatFiscalYearsToDayMonth(fiscal_year);
 */

export const formatFiscalYearsToDayMonth = (fiscalYears: any) => {
    return fiscalYears.map((fy: any) => ({
        ...fy,
        fisc_year_start: formatFiscalYearToDayMonth(fy.fisc_year_start),
        fisc_year_end: formatFiscalYearToDayMonth(fy.fisc_year_end)
    }));
};

/**
 * Formats fiscal years to a "DMM" format for both start and end dates.
 * @param fiscalYears - An array of fiscal year objects.
 * @returns An array of fiscal year objects with formatted start and end dates.
 * @example
 * const formattedFiscalYears = formatFiscalYearsToChar(fiscal_year);
 */
export const formatFiscalYearsToChar = (fiscalYears: any) => {
    return fiscalYears.map((fy: any) => ({
        ...fy,
        fisc_year_start: formatFiscalYearToChar(fy.fisc_year_start.toString()),
        fisc_year_end: formatFiscalYearToChar(fy.fisc_year_end.toString())
    }));
};

