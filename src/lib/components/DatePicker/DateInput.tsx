import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { 
  useDateState, 
  useDatePickerConfig, 
  useDisplayCustomization 
} from './DatePickerProvider';
import CalendarIcon from '../../assets/svg/calendar.svg';
import PrevIcon from '../../assets/svg/prev.svg';
import NextIcon from '../../assets/svg/next.svg';

interface DateInputProps {
  type: 'from' | 'to';
  showIcon?: boolean;
  tabIndex?: number;
  nonFocusable?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  type,
  showIcon = false,
  tabIndex = 0,
  nonFocusable = false,
}) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);

  const {
    fromDate,
    toDate,
    inputFocus,
    handleClickDateInput,
    handleChangeDate
  } = useDateState();

  const {
    isSingle,
    minDate,
    maxDate,
    dateFormat
  } = useDatePickerConfig();

  const {
    startDatePlaceholder,
    endDatePlaceholder
  } = useDisplayCustomization();

  const value = type === 'from' ? fromDate : toDate;
  const placeholder = type === 'from' ? startDatePlaceholder : endDatePlaceholder;

  useEffect(() => {
    if (value) {
      let text = value.format('ddd, DD MMM');
      if (dateFormat) {
        text = value.format(dateFormat);
      }
      setFormattedDate(text);

      const minDateDayjs = minDate ? dayjs(minDate) : null;
      const maxDateDayjs = maxDate ? dayjs(maxDate) : null;

      if ((minDateDayjs?.add(1, 'day').isAfter(value, 'date'))
        || (type === 'to' && fromDate && value.isBefore(fromDate.add(1, 'day'), 'date'))
      ) {
        setDisablePrev(true);
      } else {
        setDisablePrev(false);
      }

      if (maxDateDayjs?.subtract(1, 'day').isBefore(value, 'date')) {
        setDisableNext(true);
      } else {
        setDisableNext(false);
      }
    } else {
      setFormattedDate(null);
    }
  }, [value, fromDate, minDate, maxDate, dateFormat, type]);

  const prevDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value) {
      handleChangeDate(value.subtract(1, 'day'), type);
    }
  };

  const nextDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value) {
      handleChangeDate(value.add(1, 'day'), type);
    }
  };

  const handleClick = () => {
    handleClickDateInput(type);
  };

  return (
    <div
      className={cx('date', { 
        'is-focus': inputFocus === type, 
        'is-single': isSingle 
      })}
      role="button"
      tabIndex={nonFocusable ? -1 : tabIndex}
      onClick={handleClick}
      id={`${type}-date-input-button`}
    >
      {showIcon && (
        <CalendarIcon className="icon-calendar" viewBox="0 0 24 24" />
      )}

      <div className="selected-date">
        {formattedDate ?? <div className="date-placeholder">{placeholder}</div>}
      </div>
      
      {formattedDate && (
        <div className="change-date-group">
          <button
            type="button"
            className="btn-outline change-date-button"
            onClick={prevDate}
            tabIndex={nonFocusable ? -1 : 0}
            disabled={disablePrev}
          >
            <PrevIcon viewBox="0 0 24 24" className="icon-arrow" />
          </button>
          <button
            type="button"
            className="btn-outline change-date-button"
            onClick={nextDate}
            tabIndex={nonFocusable ? -1 : 0}
            disabled={disableNext}
          >
            <NextIcon viewBox="0 0 24 24" className="icon-arrow" />
          </button>
        </div>
      )}
    </div>
  );
};