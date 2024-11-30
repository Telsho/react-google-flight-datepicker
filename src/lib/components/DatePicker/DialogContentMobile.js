import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import MonthCalendar from './MonthCalendar';
import { getMonthInfo, getWeekDay } from '../../helpers';

const DialogContentMobile = ({
  fromDate,
  toDate,
  hoverDate,
  onSelectDate,
  startWeekDay,
  minDate,
  maxDate,
  monthFormat,
  weekDayFormat,
  complsOpen,
  isSingle,
  highlightToday,
  tooltip,
  subTextDict
}) => {
  const [rowCount, setRowCount] = useState(2400);
  const minYear = minDate ? dayjs(minDate).year() : 1900;
  const minMonth = minDate ? dayjs(minDate).month() : 0;
  const listRef = useRef();

  useEffect(() => {
    if (maxDate) {
      const _minDate = minDate ? dayjs(minDate) : dayjs('1900-01-01');
      setRowCount(dayjs(maxDate).diff(_minDate, 'month') + 1);
    }
  }, []);

  useEffect(() => {
    if (listRef.current && complsOpen) {
      const date = fromDate ? dayjs(fromDate) : dayjs();
      let monthDiff = date.diff(dayjs('1900-01-01'), 'month');

      if (minDate) {
        monthDiff = date.diff(dayjs(minDate), 'month');
      }

      listRef.current.scrollToItem(monthDiff + 1, 'smart');
    }
  }, [complsOpen]);

  function getMonthYearFromIndex(index) {
    const _index = index + minMonth;
    const year = minYear + Math.floor(_index / 12);
    const month = _index % 12;

    return { year, month };
  }

  // eslint-disable-next-line react/prop-types
  const Row = ({ index, style }) => {
    const { year, month } = getMonthYearFromIndex(index);

    return (
      <div style={style}>
        <MonthCalendar
          month={month}
          year={year}
          onSelectDate={onSelectDate}
          fromDate={fromDate}
          toDate={toDate}
          hoverDate={hoverDate}
          startWeekDay={startWeekDay}
          minDate={minDate}
          maxDate={maxDate}
          monthFormat={monthFormat}
          isSingle={isSingle}
          highlightToday={highlightToday}
          tooltip={tooltip}
          subTextDict={subTextDict}
        />
      </div>
    );
  };

  function getItemSize(index) {
    const { year, month } = getMonthYearFromIndex(index);
    const { totalWeek } = getMonthInfo(year, month, 'monday');

    return totalWeek.length * 48 + 34;
  }

  function renderMonthCalendars() {
    return (
      <AutoSizer>
        {({ height, width }) => (
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
  }

  function generateWeekDay() {
    const arrWeekDay = getWeekDay(startWeekDay, weekDayFormat);

    return arrWeekDay.map((day, index) => (
      <div className="weekday" key={index}>{day}</div>
    ));
  }

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

DialogContentMobile.propTypes = {
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  onSelectDate: PropTypes.func,
  startWeekDay: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  monthFormat: PropTypes.string,
  complsOpen: PropTypes.bool,
  isSingle: PropTypes.bool,
  highlightToday: PropTypes.bool,
  weekDayFormat: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  subTextDict: PropTypes.object
};

DialogContentMobile.defaultProps = {
  fromDate: null,
  toDate: null,
  hoverDate: null,
  onSelectDate: () => {},
  startWeekDay: null,
  minDate: null,
  maxDate: null,
  monthFormat: '',
  complsOpen: false,
  isSingle: false,
  highlightToday: false,
  weekDayFormat: '',
  tooltip: '',
  subTextDict: null
};

export default DialogContentMobile;
