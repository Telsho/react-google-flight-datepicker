import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
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

// Client-side check hook
const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  return isClient;
};

export const DialogContentDesktop: React.FC<DialogContentDesktopProps> = ({
  dateChanged = null,
}) => {
  const isClient = useClientSide();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [translateAmount, setTranslateAmount] = useState(0);
  const [monthArray, setMonthArray] = useState<Dayjs[]>([]);
  const [focusDate, setFocusDate] = useState<Dayjs | null>(null);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [dayValue, setDayValue] = useState<Dayjs | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { fromDate } = useDateState();
  const { minDate, maxDate, singleCalendar } = useDatePickerConfig();
  const { complsOpen } = useUIState();
  const { tooltip } = useDisplayCustomization();

  const getArrayMonth = useCallback((date: Dayjs): Dayjs[] => [
    date.subtract(1, "month"),
    date,
    date.add(1, "month"),
    date.add(2, "month"),
  ], []);

  // Width calculation with resize observer
  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const updateDimensions = () => {
      const width = containerRef.current!.offsetWidth;
      const style = window.getComputedStyle(containerRef.current!);
      const translateValue = singleCalendar
        ? width + parseInt(style.marginLeft) - 8
        : width / 2;
      setWrapperWidth(translateValue);
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [isClient, singleCalendar]);

  // Focus date initialization
  useEffect(() => {
    setFocusDate(fromDate ?? dayjs());
  }, [complsOpen, fromDate]);

  // Month array and navigation controls
  useEffect(() => {
    if (!focusDate) return;

    // Convert Date to Dayjs before using date math
    const minDayjs = minDate ? dayjs(minDate) : null;
    const maxDayjs = maxDate ? dayjs(maxDate) : null;

    setDisablePrev(
      Boolean(
        minDayjs && 
        focusDate.isBefore(minDayjs.add(1, "month"), "month")
      )
    );
    
    setDisableNext(
      Boolean(
        maxDayjs &&
        focusDate.isAfter(maxDayjs.subtract(2, "month"), "month")
      )
    );

    setMonthArray(getArrayMonth(focusDate));
  }, [focusDate, minDate, maxDate, getArrayMonth]);

  // Date change handler
  useEffect(() => {
    if (!dateChanged || !focusDate) return;

    const monthDiff = dateChanged.diff(focusDate, "month");
    if (monthDiff < -1) decreaseCurrentMonth();
    if (monthDiff > 1) increaseCurrentMonth();
  }, [dateChanged, focusDate]);

  // Animation handlers
  const handleMonthChange = useCallback((direction: "next" | "prev") => () => {
    if ((direction === "next" && disableNext) || 
        (direction === "prev" && disablePrev) || 
        isAnimating) return;

    setIsAnimating(true);
    setTranslateAmount(direction === "next" ? -wrapperWidth : wrapperWidth);

    const timer = setTimeout(() => {
      setFocusDate(prev => {
        const newDate = direction === "next" 
          ? prev!.add(1, "month") 
          : prev!.subtract(1, "month");
        setMonthArray(getArrayMonth(newDate));
        return newDate;
      });
      setTranslateAmount(0);
      setIsAnimating(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [disableNext, disablePrev, isAnimating, wrapperWidth, getArrayMonth]);

  const [increaseCurrentMonth, decreaseCurrentMonth] = useMemo(
    () => [handleMonthChange("next"), handleMonthChange("prev")],
    [handleMonthChange]
  );

  // Focus management
  const focusOnCalendar = useCallback(() => {
    if (!isClient || !containerRef.current) return;

    const selector = ".day.selected, .month-calendar:not(.hidden) .day:not(.disabled)";
    const focusTarget = containerRef.current.querySelector<HTMLElement>(selector);
    focusTarget?.focus();
  }, [isClient]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const dayIndex = target.getAttribute("data-day-index");
    if (!dayIndex) return;

    e.preventDefault();
    
    const calendarContainer = target.closest(".calendar-wrapper");
    const dateValue = parseInt(target.dataset.dateValue ?? "0");
    const date = dayjs(dateValue);
    const lastDate = date.endOf("month").date();

    let newIndex = parseInt(dayIndex);
    switch (e.key) {
      case "ArrowLeft": newIndex--; break;
      case "ArrowUp": newIndex -= 7; break;
      case "ArrowRight": newIndex++; break;
      case "ArrowDown": newIndex += 7; break;
      case " ": target.click(); return;
      default: return;
    }

    if (newIndex > 0 && newIndex <= lastDate) {
      calendarContainer?.querySelector<HTMLElement>(`[data-day-index="${newIndex}"]`)?.focus();
    } else {
      const newDate = date.add(newIndex - parseInt(dayIndex), "day");
      const monthDiff = newDate.diff(focusDate, "month");
      
      if (monthDiff > 1 && !disableNext) increaseCurrentMonth();
      if (monthDiff < 0 && !disablePrev) decreaseCurrentMonth();

      setTimeout(() => {
        calendarContainer?.querySelector<HTMLElement>(
          `[data-month-index="${newDate.month() + 1}"] [data-day-index="${newDate.date()}"]`
        )?.focus();
      }, 200);
    }
  }, [focusDate, disableNext, disablePrev, increaseCurrentMonth, decreaseCurrentMonth]);

  // Tooltip rendering
  const renderTooltip = useMemo(() => {
    if (!tooltip || !isClient) return null;
    
    const content = typeof tooltip === "function" 
      ? tooltip(dayValue?.toDate() ?? new Date()) 
      : tooltip;

    return (
      <div id="day-tooltip" className="tooltip-text" ref={tooltipRef}>
        {content}
      </div>
    );
  }, [tooltip, dayValue, isClient]);

  // Calendar rendering
  const calendarMonths = useMemo(() => 
    monthArray.map((date, index) => {
      const isVisible = index === 1 || index === 2;
      const isSlidingNext = isAnimating && translateAmount < 0 && index === 3;
      const isSlidingPrev = isAnimating && translateAmount > 0 && index === 0;

      return (
        <MonthCalendar
          key={`${date.year()}-${date.month()}`}
          hidden={!isVisible && !isSlidingNext && !isSlidingPrev}
          isAnimating={isSlidingNext || isSlidingPrev}
          month={date.month()}
          year={date.year()}
          handleHoverDay={setDayValue}
          ref={tooltipRef}
          className={cx({ 'slide-next': isSlidingNext, 'slide-prev': isSlidingPrev })}
        />
      );
    }), 
  [monthArray, isAnimating, translateAmount]);

  return (
    <div className="relative">
      {renderTooltip}
      <div 
        className={cx("calendar-wrapper", { single: singleCalendar })} 
        ref={containerRef}
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label="Calendar"
      >
        <div
          className={cx("calendar-content", { isAnimating })}
          style={{ transform: `translateX(${translateAmount}px)` }}
        >
          {calendarMonths}
        </div>
        
        <div className="calendar-flippers">
          <button
            className={cx("flipper-button", { disabled: disablePrev })}
            onClick={decreaseCurrentMonth}
            onKeyDown={(e) => e.key === " " && decreaseCurrentMonth()}
            disabled={disablePrev}
            aria-label="Previous month"
          >
            <PrevIcon viewBox="0 0 24 24" />
          </button>
          <button
            className={cx("flipper-button", { disabled: disableNext })}
            onClick={increaseCurrentMonth}
            onKeyDown={(e) => e.key === " " && increaseCurrentMonth()}
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