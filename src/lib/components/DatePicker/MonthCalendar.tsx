import React, { forwardRef } from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { useDatePickerConfig } from './DatePickerProvider';
import {Week} from './Week';
import { getMonthInfo, getWeekDay } from '../../helpers';

interface MonthCalendarProps {
  month: number;
  year: number;
  hidden: boolean;
  isAnimating: boolean;
  handleHoverDay: (e: React.MouseEvent, weekIndex: number) => void;
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
  handleHoverDay
}, ref) => {

  const {
    startWeekDay,
    weekDayFormat,
    monthFormat,
    singleCalendar
  } = useDatePickerConfig();

  const generateWeek = (): JSX.Element[] => {
    const { totalWeek, totalDay } = getMonthInfo(year, month, startWeekDay);

    return totalWeek.map((week, index) => (
      <Week
        key={index}
        week={week}
        month={month}
        year={year}
        isFirst={index === 0}
        totalDay={totalDay}
        weekIndex={index}
        handleHoverDay={handleHoverDay}
        ref={ref}
      />
    ));
  };

  const generateWeekDay = (): JSX.Element[] => {
    const arrWeekDay: string[] = getWeekDay(startWeekDay, weekDayFormat);

    return arrWeekDay.map((day, index) => (
      <div className="weekday" key={index}>
        {day}
      </div>
    ));
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
      })}
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

// Add display name for dev tools
MonthCalendar.displayName = 'MonthCalendar';