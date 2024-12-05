import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import dayjs from 'dayjs';

import CalendarIcon from '../../assets/svg/calendar.svg';
import PrevIcon from '../../assets/svg/prev.svg';
import NextIcon from '../../assets/svg/next.svg';

const DateInput = ({
  handleClickDateInput = () => {},
  showIcon = false,
  tabIndex = '',
  isFocus = false,
  value = null,
  placeholder = null,
  handleChangeDate = () => {},
  dateFormat = '',
  isSingle = false,
  onFocus = () => {},
  name = '',
  nonFocusable = false,
  fromDate = null,
  minDate = null,
  maxDate = null,
}) => {
  const [formattedDate, setFormattedDate] = useState(null);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);

  useEffect(() => {
    if (value) {
      let text = value.format('ddd, DD MMM');
      if (dateFormat) {
        text = value.format(dateFormat);
      }
      setFormattedDate(text);

      if ((minDate && dayjs(minDate).add(1, 'day').isAfter(value, 'date'))
        || (name === 'END_DATE' && value.isBefore(fromDate.add(1, 'day'), 'date'))
      ) {
        setDisablePrev(true);
      } else {
        setDisablePrev(false);
      }

      if (maxDate && dayjs(maxDate).subtract(1, 'day').isBefore(value, 'date')) {
        setDisableNext(true);
      } else {
        setDisableNext(false);
      }
    } else {
      setFormattedDate(null);
    }
  }, [value, fromDate]);

  function prevDate(e) {
    e.stopPropagation();
    handleChangeDate('prev', value);
  }

  function nextDate(e) {
    e.stopPropagation();
    handleChangeDate('next', value);
  }

  function onDateInputFocus() {
    if (onFocus) onFocus(name);
  }

  return (
    <div
      className={cx('date', { 'is-focus': isFocus, 'is-single': isSingle })}
      role="button"
      tabIndex={nonFocusable ? '-1' : tabIndex}
      onClick={handleClickDateInput}
      onFocus={onDateInputFocus}
      id={name === 'START_DATE' ? 'start-date-input-button' : 'end-date-input-button'}
    >
      {showIcon && (
        <CalendarIcon className="icon-calendar" viewBox="0 0 24 24" />
      )}

      <div className="selected-date">
        {formattedDate || <div className="date-placeholder">{placeholder}</div>}
      </div>
      {formattedDate && (
        <div className="change-date-group">
          <button
            type="button"
            className="btn-outline change-date-button"
            onClick={prevDate}
            tabIndex={nonFocusable ? '-1' : '0'}
            disabled={disablePrev}
          >
            <PrevIcon viewBox="0 0 24 24" className="icon-arrow" />
          </button>
          <button
            type="button"
            className="btn-outline change-date-button"
            onClick={nextDate}
            tabIndex={nonFocusable ? '-1' : '0'}
            disabled={disableNext}
          >
            <NextIcon viewBox="0 0 24 24" className="icon-arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

DateInput.propTypes = {
  handleClickDateInput: PropTypes.func,
  showIcon: PropTypes.bool,
  tabIndex: PropTypes.string,
  isFocus: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
  handleChangeDate: PropTypes.func,
  dateFormat: PropTypes.string,
  isSingle: PropTypes.bool,
  onFocus: PropTypes.func,
  name: PropTypes.string,
  nonFocusable: PropTypes.bool,
  fromDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
};

export default DateInput;
