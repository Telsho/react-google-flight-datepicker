import React, { useEffect, useState, useRef, useCallback,  KeyboardEvent as ReactKeyboardEvent } from "react";
import cx from "classnames";
import dayjs, { Dayjs } from "dayjs";
import {
  useDateState,
  useDatePickerConfig,
  useDisplayCustomization,
  useUIState,
} from "./DatePickerProvider";
import PrevIcon from "../../assets/svg/prev.svg";
import NextIcon from "../../assets/svg/next.svg";
import { MonthCalendar } from "./MonthCalendar";

interface DialogContentDesktopProps {
  dateChanged?: Dayjs | null;
}

interface KeyboardEvent extends React.KeyboardEvent {
  target: HTMLElement;
}

export const DialogContentDesktop: React.FC<DialogContentDesktopProps> = ({
  dateChanged = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [translateAmount, setTranslateAmount] = useState<number>(0);
  const [monthArray, setMonthArray] = useState<Dayjs[]>([]);
  const [focusDate, setFocusDate] = useState<Dayjs>(dayjs());
  const [disablePrev, setDisablePrev] = useState<boolean>(false);
  const [disableNext, setDisableNext] = useState<boolean>(false);
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const [dayValue, setDayValue] = useState<Dayjs | null>(null);

  const { fromDate } = useDateState();
  const { minDate, maxDate, singleCalendar } = useDatePickerConfig();
  const { complsOpen } = useUIState();
  const { tooltip } = useDisplayCustomization();

  const getArrayMonth = (date: Dayjs, useSingleCalendar?: boolean): Dayjs[] => {
    const prevMonth = dayjs(date).subtract(1, "month");
    const nextMonth = dayjs(date).add(1, "month");
    const futureMonth = dayjs(date).add(2, "month");

    return useSingleCalendar 
      ? [prevMonth, focusDate, nextMonth]
      : [prevMonth, focusDate, nextMonth, futureMonth];
  };

  const handleHoverDay = useCallback((e: React.MouseEvent, date: number) => {
    setDayValue(dayjs(date));
  }, []);

  const handleMonthChange = (direction: 'next' | 'prev') => (date?: Dayjs): void => {
    const isDisabled = direction === 'next' ? disableNext : disablePrev;
    if (isDisabled) return;

    const translateValue = direction === 'next' ? -wrapperWidth : wrapperWidth;
    setTranslateAmount(translateValue);
    
    setTimeout(() => {
      if (direction === 'next') {
        setFocusDate(date ?? dayjs(focusDate).add(1, "month"));
      } else {
        setFocusDate(date ?? dayjs(focusDate).subtract(1, "month"));
      }
      setTranslateAmount(0);
    }, 200);
  };

  const increaseCurrentMonth = handleMonthChange('next');
  const decreaseCurrentMonth = handleMonthChange('prev');

  const focusOnCalendar = (): void => {
    const selectedButton = containerRef.current?.querySelector<HTMLElement>(".day.selected") ??
      containerRef.current?.querySelector<HTMLElement>(".month-calendar:not(.hidden) .day:not(.disabled)");
    
    selectedButton?.focus();
  };

  const handleKeyboardNavigation = (e: ReactKeyboardEvent<HTMLDivElement>): boolean => {
    const target = e.target as HTMLElement;
    const allowedKeys = ['Tab', 'Space', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
    const dayIndex = target.getAttribute("data-day-index");
    
    if (!allowedKeys.includes(e.key) || !dayIndex) {
      return true;
    }
  
    e.preventDefault();
    
    const calendarContainer = target.closest('.calendar-wrapper') as HTMLElement;
    const dateValue = parseInt(target.getAttribute("data-date-value") ?? "0");
    const date = dayjs(dateValue);
    const lastDateOfMonth = date.add(1, "month").set("date", 0).get("date");
    const currentDayIndex = parseInt(dayIndex);
    
    let nextDayIndex = currentDayIndex;
  
    switch (e.key) {
      case 'Tab': {
        const dialogContent = calendarContainer.closest('.dialog-content') as HTMLElement;
        const doneButton = dialogContent.querySelector<HTMLElement>(".submit-button");
        doneButton?.focus();
        return true;
      }
      case 'Space':
        target.click();
        break;
      case 'ArrowLeft':
        nextDayIndex = currentDayIndex - 1;
        break;
      case 'ArrowUp':
        nextDayIndex = currentDayIndex - 7;
        break;
      case 'ArrowRight':
        nextDayIndex = currentDayIndex + 1;
        break;
      case 'ArrowDown':
        nextDayIndex = currentDayIndex + 7;
        break;
    }
  
    if (nextDayIndex > 0 && nextDayIndex <= lastDateOfMonth) {
      const monthCalendar = target.closest('.month-calendar') as HTMLElement;
      const nextDay = monthCalendar?.querySelector<HTMLElement>(
        `.day[data-day-index="${nextDayIndex}"]`
      );
      nextDay?.focus();
    } else {
      const nextDate = date.add(nextDayIndex - currentDayIndex, "day");
      const monthDiff = Math.ceil(nextDate.diff(focusDate, "month", true));
  
      if (monthDiff > 1) {
        if (maxDate && dayjs(nextDate).isAfter(maxDate, "month")) return false;
        increaseCurrentMonth();
      } else if (monthDiff < 0) {
        if (minDate && dayjs(nextDate).isBefore(minDate, "month")) return false;
        decreaseCurrentMonth();
      }
  
      setTimeout(() => {
        if (!calendarContainer) return;
        const query = `.month-calendar[data-month-index="${
          nextDate.get("month") + 1
        }"] .day[data-day-index="${nextDate.get("date")}"]`;
        const nextElement = calendarContainer.querySelector<HTMLElement>(query);
        nextElement?.focus();
      }, 200);
    }
  
    return false;
  };

  const handleFunctionKey = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  useEffect(() => {
    const width = containerRef.current?.offsetWidth ?? 0;
    const style = window.getComputedStyle(containerRef.current ?? document.createElement('div'));
    const _translateAmount = singleCalendar
      ? width + parseInt(style.marginLeft) - 8
      : width / 2;
    setWrapperWidth(_translateAmount);
  }, [containerRef.current, singleCalendar]);

  useEffect(() => {
    setFocusDate(fromDate ?? dayjs());
  }, [complsOpen, fromDate]);

  useEffect(() => {
    setDisablePrev(Boolean(minDate && focusDate.isBefore(dayjs(minDate).add(1, "month"), "month")));
    setDisableNext(Boolean(maxDate && focusDate.isAfter(dayjs(maxDate).subtract(2, "month"), "month")));
    setMonthArray(getArrayMonth(focusDate, singleCalendar));
  }, [focusDate, minDate, maxDate, singleCalendar]);

  useEffect(() => {
    if (!dateChanged) return;
    
    if (dayjs(dateChanged).isBefore(focusDate, "month")) {
      decreaseCurrentMonth(dateChanged);
    } else if (dayjs(dateChanged).isAfter(focusDate.add(1, "month"), "month")) {
      increaseCurrentMonth(dayjs(dateChanged).subtract(1, "month"));
    }
  }, [dateChanged, focusDate]);

  return (
    <div className="relative">
      {tooltip && (
        <div id="day-tooltip" className="tooltip-text" ref={tooltipRef}>
          {typeof tooltip === "function"
            ? tooltip(dayValue?.toDate() ?? new Date())
            : tooltip}
        </div>
      )}
      <div
        className={cx("calendar-wrapper", { single: singleCalendar })}
        ref={containerRef}
        onKeyDown={handleKeyboardNavigation}
      >
        <div
          className={cx("calendar-content", {
            isAnimating: translateAmount !== 0,
            single: singleCalendar,
          })}
          style={{ transform: `translateX(${translateAmount}px)` }}
        >
          {monthArray.map((date, dateIndex) => (
            <MonthCalendar
              key={dateIndex}
              hidden={dateIndex === 0 && translateAmount <= 0}
              isAnimating={dateIndex === 0 && translateAmount > 0}
              month={date.get("month")}
              year={date.get("year")}
              handleHoverDay={handleHoverDay}
              ref={tooltipRef}
            />
          ))}
        </div>
        <div className="calendar-flippers">
          <button
            className={cx("flipper-button", { disabled: disablePrev })}
            onClick={() => decreaseCurrentMonth()}
            onKeyDown={(e) => handleFunctionKey(e, () => decreaseCurrentMonth())}
            disabled={disablePrev}
            aria-label="Previous month"
          >
            <PrevIcon viewBox="0 0 24 24" />
          </button>
          <button
            className={cx("flipper-button", { disabled: disableNext })}
            onClick={() => increaseCurrentMonth()}
            onKeyDown={(e) => handleFunctionKey(e, () => increaseCurrentMonth())}
            disabled={disableNext}
            aria-label="Next month"
            onBlur={focusOnCalendar}
          >
            <NextIcon viewBox="0 0 24 24" />
          </button>
        </div>
      </div>
    </div>
  );
};