import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import { Dayjs } from 'dayjs';
import { useDateState } from './DatePickerProvider';

interface DayProps {
  dateIndex: number;
  dateValue: Dayjs;
  isEndDay?: boolean;
  selected?: boolean;
  hovered: boolean;
  disabled: boolean | null;
  totalDay: number;
  highlight: boolean;
  handleHoverDay: (date: Dayjs) => void;
  subText: string;
}

export const Day = forwardRef<HTMLDivElement, DayProps>(({
  dateIndex,
  dateValue,
  isEndDay,
  selected,
  hovered,
  disabled,
  totalDay,
  highlight,
  handleHoverDay,
  subText,
}, ref) => {
  const dayRef = useRef<HTMLDivElement>(null);
  const { onSelectDate, onHoverDate } = useDateState();

  const selectDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    onSelectDate(dateValue);
  };

  const handleHoverDate = () => {
    if (disabled) return;
    onHoverDate(dateValue);
    handleHoverDay(dateValue);
  };

  const handleTooltipPosition = useCallback(() => {
    // Check if ref exists and is a RefObject
    if (!ref || typeof ref === 'function') return;
    const element = ref.current;
    if (element && dayRef.current) {
      element.style.left = `${
        dayRef.current.offsetLeft - element.offsetWidth + 135
      }px`;
      element.style.top = `${
        dayRef.current.offsetTop - element.offsetHeight - 15
      }px`;
      element.style.visibility = 'visible';
    }
  }, [ref]);

  const handleTooltipHidden = useCallback(() => {
    if (!ref || typeof ref === 'function') return;
    const element = ref.current;
    if (element) {
      element.style.visibility = 'hidden';
    }
  }, [ref]);

  useEffect(() => {
    const currentRef = dayRef.current;
    if (currentRef) {
      currentRef.addEventListener('mouseover', handleTooltipPosition);
      currentRef.addEventListener('mouseleave', handleTooltipHidden);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mouseover', handleTooltipPosition);
        currentRef.removeEventListener('mouseleave', handleTooltipHidden);
      }
    };
  }, [handleTooltipPosition, handleTooltipHidden]);

  return (
    <div
      className={cx('day', {
        selected,
        hovered,
        disabled,
        highlight,
        end: isEndDay,
        'has-subtext': !!subText,
      })}
      onClick={selectDate}
      onMouseEnter={handleHoverDate}
      role="button"
      tabIndex={-1}
      data-day-index={dateIndex}
      data-date-value={dateValue.valueOf()}
      ref={dayRef}
    >
      {hovered &&
        !(isEndDay && dateIndex === totalDay) &&
        !(dateIndex === 1 && selected && !isEndDay) && (
          <div
            className={cx('background-day', {
              'first-day': dateIndex === 1,
              'last-day': dateIndex === totalDay,
            })}
          />
      )}
      <div className="day-content">
        <div className="text-day">{dateIndex}</div>
        {subText && (
          <div
            className="sub-text"
            style={{
              position: 'relative',
              zIndex: 3,
              color: (selected && !hovered) ? '#fff' : '#666',
            }}
          >
            {subText}
          </div>
        )}
      </div>
    </div>
  );
});

Day.displayName = 'Day';