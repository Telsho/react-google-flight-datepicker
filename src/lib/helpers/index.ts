import dayjs from "dayjs";

interface Week {
  start: number;
  days: number;
}

interface MonthInfo {
  totalWeek: Week[];
  totalDay: number;
}

type WeekDayFormat = 'dd' | 'ddd' | 'dddd';
type StartWeekDay = 'sunday' | 'monday';

export function getMonthInfo(
  year: number,
  month: number,
  startDay: StartWeekDay
): MonthInfo {
  const weeks: Week[] = [];
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const numDays = lastDate.getDate();

  let start = 1;
  let end = firstDate.getDay() === 0 ? 1 : 7 - firstDate.getDay() + 1;
  if (startDay === 'sunday') {
    end = 7 - firstDate.getDay();
  }
  
  while (start <= numDays) {
    weeks.push({ start, days: end - start + 1 });
    start = end + 1;
    end += 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
      end = numDays;
    }
  }

  return { totalWeek: weeks, totalDay: numDays };
}

export function getWeekDay(
  startWeekDay: StartWeekDay | null,
  weekDayFormat: WeekDayFormat | string
): string[] {
  const days = [...Array(7)].map((_, i) => 
    dayjs().day(i).format(weekDayFormat === 'dd' ? 'dd' : 
                         weekDayFormat === 'ddd' ? 'ddd' : 'dddd')
  );

  if (startWeekDay === 'sunday') {
    const last = days.pop();
    if (last) {
      days.unshift(last);
    }
  }
  
  return days;
}

type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(
    this: any,
    ...args: Parameters<T>
  ): void {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}


export const loadLocale = async (locale: string) => {
  try {
    if (locale === 'en') return true;
    await import(`dayjs/locale/${locale}.js`);
    return true;
  } catch (error) {
    console.error(`Failed to load locale ${locale}:`, error);
    return false;
  }
};