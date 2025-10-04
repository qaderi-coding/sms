import { appI18next } from '../../i18n';
import { Dictionary } from '../types/IDictionary';
import { DatePickerFieldType } from '../../ui-custom/props/BaseInputProps';
import { format as JalaliFormat } from 'date-fns-jalali';

export const DateTimeFormat = {
    iso: 'yyy-MM-ddThh:mm:ss.SSSZ',
    date: 'yyy-MM-dd',
    time: 'hh:mm a',
    datetime: 'yyy-MM-dd hh:mm a'
} as Dictionary;

export function showDate(date?: string | Date | null, format?: DatePickerFieldType) {
    if (date) {
        let formatter = format ? DateTimeFormat[format] : DateTimeFormat['date'];
        if (typeof date === 'string') {
            return JalaliFormat(new Date(date), formatter);
        }
        return JalaliFormat(date, formatter);
    }
    return date;
}

export function toISODate(date?: any): string {
    if (!date || typeof date !== 'string') return '';

    // If already in full ISO format (ends with 'Z'), return as-is
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(date)) {
        return date;
    }

    // If it's like "2025-07-07T19:30:00", add ".000Z"
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)) {
        return date + '.000Z';
    }

    // If it's like "2025-07-07 19:30:00", convert to ISO
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
        return date.replace(' ', 'T') + '.000Z';
    }

    // If it's already near ISO but missing 'Z', add it
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(date)) {
        return date + 'Z';
    }

    // NEW: Handle date-only format "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date + 'T00:00:00.000Z';
    }

    return '';
}

export function scheduleJob(time: any, callback: any) {
    if (typeof time === 'string') {
        time = new Date(toISODate(time)).getTime() - new Date().getTime();
    }
    setTimeout(callback, time);
}

// utils/dateValidation.ts

export function getTodayISODate(): string {
    return new Date().toISOString().split('T')[0]; // e.g., '2025-05-06'
}

export function toISODateOnly(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

export function isDateNotInFuture(date: any): boolean {
    console.log('isDateNotInTheFuture', date);
    if (!date) return true; // optional dates pass
    const todayDateISO = new Date(toISODateOnly(new Date()));
    const dateISO = new Date(toISODateOnly(date));
    return dateISO <= todayDateISO;
}

export function isStartBeforeEnd(start: any, end: any): boolean {
    if (!start || !end) return true; // if either is missing, pass validation
    return start <= end;
}

export function isLicenseDateAfterEnterprise(liscenseStartDate: any, enterpriseStartDate: any): boolean {
    if (!liscenseStartDate || !enterpriseStartDate) return true; // if either is missing, pass validation
    liscenseStartDate = new Date(toISODateOnly(liscenseStartDate));
    enterpriseStartDate = new Date(toISODateOnly(enterpriseStartDate));
    console.log(liscenseStartDate, 'license start date');
    console.log(enterpriseStartDate, 'enterprise start date');
    return liscenseStartDate >= enterpriseStartDate;
}

export function getCurrentISODate(): string {
    return new Date().toISOString(); // returns current date in ISO format
}

export function formatDateForApi(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('.')[0].replace('Z', '');
}

