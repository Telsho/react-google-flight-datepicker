import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { 
  useDateState, 
  useDatePickerConfig,
  useDisplayCustomization, 
  useUIState
} from './DatePickerProvider';
import {MonthCalendar} from './MonthCalendar';
import { getMonthInfo, getWeekDay } from '../../helpers';

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

export const DialogContentMobile: React.FC = () => {
  const [rowCount, setRowCount] = useState(2400);
  const listRef = useRef<List>(null);

  const {
    fromDate,
  } = useDateState();

  const {
    startWeekDay,
    minDate,
    maxDate,
    weekDayFormat
  } = useDatePickerConfig();

  const {
    complsOpen
  } = useUIState()

  const {
    tooltip,
    subTextDict
  } = useDisplayCustomization();

  const minYear = minDate ? dayjs(minDate).year() : 1900;
  const minMonth = minDate ? dayjs(minDate).month() : 0;

  useEffect(() => {
    if (maxDate) {
      const _minDate = minDate ? dayjs(minDate) : dayjs('1900-01-01');
      setRowCount(dayjs(maxDate).diff(_minDate, 'month') + 1);
    }
  }, [maxDate, minDate]);

  useEffect(() => {
    if (listRef.current && complsOpen) {
      const date = fromDate ? dayjs(fromDate) : dayjs();
      let monthDiff = date.diff(dayjs('1900-01-01'), 'month');

      if (minDate) {
        monthDiff = date.diff(dayjs(minDate), 'month');
      }

      listRef.current.scrollToItem(monthDiff + 1, 'smart');
    }
  }, [complsOpen, fromDate, minDate]);

  const getMonthYearFromIndex = (index: number) => {
    const _index = index + minMonth;
    const year = minYear + Math.floor(_index / 12);
    const month = _index % 12;

    return { year, month };
  };

  const Row = React.memo(({ index, style }: RowProps) => {
    const { year, month } = getMonthYearFromIndex(index);

    return (
      <div style={style}>
        <MonthCalendar
          month={month}
          year={year}
          hidden={false}
          isAnimating={false}
          handleHoverDay={() => {}} // Mobile doesn't use hover
        />
      </div>
    );
  });
  Row.displayName = 'CalendarRow';

  const getItemSize = (index: number) => {
    const { year, month } = getMonthYearFromIndex(index);
    const { totalWeek } = getMonthInfo(year, month, startWeekDay || 'monday');

    return totalWeek.length * 48 + 34;
  };

  const renderMonthCalendars = () => {
    return (
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            ref={listRef}
            width={width}
            height={height - 36}
            itemCount={rowCount}
            itemSize={getItemSize}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    );
  };

  const generateWeekDay = () => {
    const arrWeekDay = getWeekDay(startWeekDay || 'monday', weekDayFormat);

    return arrWeekDay.map((day, index) => (
      <div className="weekday" key={index}>
        {day}
      </div>
    ));
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-content">
        <div className="weekdays mobile">
          {generateWeekDay()}
        </div>
        {renderMonthCalendars()}
      </div>
    </div>
  );
};