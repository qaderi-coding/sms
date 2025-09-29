// import { Locale } from 'date-fns';

const DateFnsJalaaliLocale: any = {
    code: 'fa-AF',
    formatDistance: (token: string, count: number) => {
        const formats: { [key: string]: string } = {
            lessThanXSeconds: 'کمتر از {{count}} ثانیه',
            xSeconds: '{{count}} ثانیه',
            halfAMinute: 'نیم دقیقه',
            lessThanXMinutes: 'کمتر از {{count}} دقیقه',
            xMinutes: '{{count}} دقیقه',
            aboutXHours: 'حدود {{count}} ساعت',
            xHours: '{{count}} ساعت',
            xDays: '{{count}} روز',
            aboutXMonths: 'حدود {{count}} ماه',
            xMonths: '{{count}} ماه',
            aboutXYears: 'حدود {{count}} سال',
            xYears: '{{count}} سال',
            overXYears: 'بیشتر از {{count}} سال',
            almostXYears: 'تقریباً {{count}} سال',
        };
        return formats[token].replace('{{count}}', count.toString());
    },
    formatLong: {
        date: () => 'yyyy-MM-dd',
        time: () => 'HH:mm a',
        dateTime: () => '{{date}} {{time}}',
    },
    formatRelative: (token: string, date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInSeconds / 3600);
        const diffInDays = Math.floor(diffInSeconds / 86400);
        const diffInMonths = Math.floor(diffInDays / 30); // Rough estimate
        const diffInYears = Math.floor(diffInDays / 365); // Rough estimate

        if (diffInSeconds < 0) {
            // Past dates
            if (diffInSeconds > -60) {
                return 'چند لحظه پیش';
            } else if (diffInMinutes === -1) {
                return 'یک دقیقه پیش';
            } else if (diffInMinutes > -60) {
                return `${-diffInMinutes} دقیقه پیش`;
            } else if (diffInHours === -1) {
                return 'یک ساعت پیش';
            } else if (diffInHours > -24) {
                return `${-diffInHours} ساعت پیش`;
            } else if (diffInDays === -1) {
                return 'دیروز';
            } else if (diffInDays < -30) {
                return `${-diffInDays} روز پیش`;
            } else if (diffInMonths === -1) {
                return 'یک ماه پیش';
            } else if (diffInMonths > -12) {
                return `${-diffInMonths} ماه پیش`;
            } else {
                return `${-diffInYears} سال پیش`;
            }
        } else {
            // Future dates
            if (diffInSeconds < 60) {
                return 'چند لحظه دیگر';
            } else if (diffInMinutes === 1) {
                return 'یک دقیقه دیگر';
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes} دقیقه دیگر`;
            } else if (diffInHours === 1) {
                return 'یک ساعت دیگر';
            } else if (diffInHours < 24) {
                return `${diffInHours} ساعت دیگر`;
            } else if (diffInDays === 1) {
                return 'فردا';
            } else if (diffInDays < 30) {
                return `${diffInDays} روز دیگر`;
            } else if (diffInMonths === 1) {
                return 'یک ماه دیگر';
            } else if (diffInMonths < 12) {
                return `${diffInMonths} ماه دیگر`;
            } else {
                return `${diffInYears} سال دیگر`;
            }
        }
    },
    localize: {
        month: (n: number) => {
            const months = [
                'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد',
                'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'
            ];
            return months[n];
        },
        day: (n: number) => {
            const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
            return days[n];
        },
        ordinal: (n: number) => {
            return `${n}م`;
        },
        week: (n: number) => `${n} هفته`
    }
};

export default DateFnsJalaaliLocale;