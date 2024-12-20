import React, { forwardRef } from 'react';
import cx from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { useDatePickerConfig } from './DatePickerProvider';
import {Week} from './Week';
import { getMonthInfo, getWeekDay } from '../../helpers';

interface MonthCalendarProps {
  month: number;
  year: number;
  hidden: boolean;
  isAnimating: boolean;
  handleHoverDay: (date: Dayjs) => void;
  className?: string; // Add support for additional classes
}

interface WeekInfo {
  totalWeek: number[][];
  totalDay: number;
}

export const MonthCalendar = forwardRef<HTMLDivElement, MonthCalendarProps>(({
  month,
  year,
  hidden = false,
  isAnimating = false,
  handleHoverDay,
  className
}, ref) => {

  const {
    startWeekDay,
    weekDayFormat,
    monthFormat,
    singleCalendar
  } = useDatePickerConfig();

  const generateWeek = (): JSX.Element[] => {
    const { totalWeek, totalDay } = getMonthInfo(year, month, startWeekDay);
  
    return totalWeek.map((week) => {
      const weekKey = `${year}-${month}-${week.start}`; // Using first day of week for key
      
      return (
        <Week
          key={weekKey}
          week={week}
          month={month}
          year={year}
          isFirst={week === totalWeek[0]}
          totalDay={totalDay}
          weekIndex={totalWeek.indexOf(week)}
          handleHoverDay={handleHoverDay}
          ref={ref}
        />
      );
    });
  };

  const generateWeekDay = (): JSX.Element[] => {
    const arrWeekDay: string[] = getWeekDay(startWeekDay, weekDayFormat);
  
    return arrWeekDay.map((day) => {
      return (
        <div className="weekday" key={`weekday-${day.toLowerCase()}`}>
          {day}
        </div>
      );
    });
  };

  const getMonthDisplay = (): string => {
    const date = dayjs(`${year}-${month + 1}-1`);
    return monthFormat 
      ? date.format(monthFormat)
      : date.format('MMMM - YYYY');
  };

  return (
    <div
      className={cx('month-calendar', {
        isAnimating,
        hidden,
        single: singleCalendar,
      }, className)} // Add the className to the classnames
      data-month-index={month + 1}
    >
      <div className="month-name">
        {getMonthDisplay()}
      </div>
      <div className="weekdays">{generateWeekDay()}</div>
      <div className="week-container">
        {generateWeek()}
      </div>
    </div>
  );
});

MonthCalendar.displayName = 'MonthCalendar';