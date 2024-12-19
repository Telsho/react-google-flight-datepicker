import React, { forwardRef } from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { 
  useDateState, 
  useDatePickerConfig,
  useDisplayCustomization 
} from './DatePickerProvider';
import { Day } from './Day';

interface WeekProps {
  isFirst: boolean;
  week: {
    days: number;
    start: number;
  };
  month: number;
  year: number;
  totalDay: number;
  weekIndex: number;
  handleHoverDay: (date: dayjs.Dayjs) => void;
}

export const Week = forwardRef<HTMLDivElement, WeekProps>(({
  isFirst,
  week,
  month,
  year,
  totalDay,
  weekIndex,
  handleHoverDay,
}, ref) => {
  const {
    fromDate,
    toDate,
    hoverDate
  } = useDateState();

  const {
    minDate,
    maxDate,
    isSingle,
    highlightToday
  } = useDatePickerConfig();

  const { subTextDict } = useDisplayCustomization();

  const generateDay = () => {
    return Array.from({ length: week.days }, (_, index) => {
      const dateIndex = index + week.start;
      const dateValue = dayjs(`${year}-${month + 1}-${dateIndex}`);
      const disabled =
        (minDate && dateValue.isBefore(minDate, 'date')) ||
        (maxDate && dateValue.isAfter(maxDate, 'date'));
      const selected =
        (fromDate && dateValue.isSame(fromDate, 'date')) ||
        (toDate && dateValue.isSame(toDate, 'date'));
      let hovered = false;
      const highlight =
        highlightToday && dateValue.isSame(new Date(), 'date');

      if (fromDate && !fromDate.isSame(toDate, 'date') && !isSingle) {
        if (
          toDate &&
          !fromDate.isAfter(dateValue, 'date') &&
          !toDate.isBefore(dateValue, 'date')
        ) {
          hovered = true;
        }
        if (
          !toDate &&
          !dateValue.isBefore(fromDate, 'date') &&
          !(hoverDate && hoverDate.isBefore(dateValue, 'date')) &&
          fromDate.isBefore(hoverDate, 'date')
        ) {
          hovered = true;
        }
      }

      const isEndDate =
        (toDate && dateValue.isSame(toDate, 'date')) ||
        (!toDate && hoverDate && dateValue.isSame(hoverDate, 'date'));

      const subText =
        !subTextDict
          ? ''
          : subTextDict[dateValue.format('YYYY-MM-DD')] ?? '\u00A0';

      return (
        <Day
          key={index}
          dateIndex={dateIndex}
          dateValue={dateValue}
          selected={selected}
          hovered={hovered}
          highlight={highlight}
          disabled={disabled}
          isEndDay={isEndDate}
          totalDay={totalDay}
          handleHoverDay={handleHoverDay}
          subText={subText}
          ref={ref}
        />
      );
    });
  };

  return (
    <div className={cx('week', { first: isFirst })}>
      {generateDay()}
    </div>
  );
});

Week.displayName = 'Week';