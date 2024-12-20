import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
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
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const { fromDate } = useDateState();
  const { minDate, maxDate, singleCalendar } = useDatePickerConfig();
  const { complsOpen } = useUIState();
  const { tooltip } = useDisplayCustomization();

  const getArrayMonth = (date: Dayjs): Dayjs[] => {
    return [
      dayjs(date).subtract(1, "month"),
      date,
      dayjs(date).add(1, "month"),
      dayjs(date).add(2, "month"),
    ];
  };

  const handleHoverDay = useCallback((date: Dayjs) => {
    setDayValue(dayjs(date));
  }, []);

  const handleMonthChange = (direction: "next" | "prev") => (): void => {
    const isDisabled = direction === "next" ? disableNext : disablePrev;
    if (isDisabled || isAnimating) return;

    setIsAnimating(true);

    // We need a slight delay to ensure the isAnimating class is applied before the transform
    requestAnimationFrame(() => {
      const translateValue = direction === "next" ? -wrapperWidth : wrapperWidth;
      setTranslateAmount(translateValue);
    });

    // Wait for the animation to complete before updating the data
    setTimeout(() => {
      const newFocusDate = direction === "next"
        ? dayjs(focusDate).add(1, "month")
        : dayjs(focusDate).subtract(1, "month");
      
      setFocusDate(newFocusDate);
      setMonthArray(getArrayMonth(newFocusDate));
      setTranslateAmount(0);
      setIsAnimating(false);
    }, 200);
  };

  const increaseCurrentMonth = handleMonthChange("next");
  const decreaseCurrentMonth = handleMonthChange("prev");

  const focusOnCalendar = (): void => {
    const selectedButton =
      containerRef.current?.querySelector<HTMLElement>(".day.selected") ??
      containerRef.current?.querySelector<HTMLElement>(
        ".month-calendar:not(.hidden) .day:not(.disabled)"
      );

    selectedButton?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement;
    const allowedKeys = [
      "Tab",
      "Space",
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
    ];
    const dayIndex = target.getAttribute("data-day-index");

    if (!allowedKeys.includes(e.key) || !dayIndex) {
      return;
    }

    e.preventDefault();

    const calendarContainer = target.closest(
      ".calendar-wrapper"
    ) as HTMLElement;
    const dateValue = parseInt(target.getAttribute("data-date-value") ?? "0");
    const date = dayjs(dateValue);
    const lastDateOfMonth = date.add(1, "month").set("date", 0).get("date");
    const currentDayIndex = parseInt(dayIndex);

    let nextDayIndex = currentDayIndex;

    switch (e.key) {
      case "Tab":
        return;
      case "Space":
        target.click();
        break;
      case "ArrowLeft":
        nextDayIndex = currentDayIndex - 1;
        break;
      case "ArrowUp":
        nextDayIndex = currentDayIndex - 7;
        break;
      case "ArrowRight":
        nextDayIndex = currentDayIndex + 1;
        break;
      case "ArrowDown":
        nextDayIndex = currentDayIndex + 7;
        break;
    }

    if (nextDayIndex > 0 && nextDayIndex <= lastDateOfMonth) {
      const monthCalendar = target.closest(".month-calendar") as HTMLElement;
      const nextDay = monthCalendar?.querySelector<HTMLElement>(
        `.day[data-day-index="${nextDayIndex}"]`
      );
      nextDay?.focus();
    } else {
      const nextDate = date.add(nextDayIndex - currentDayIndex, "day");
      const monthDiff = Math.ceil(nextDate.diff(focusDate, "month", true));

      if (monthDiff > 1) {
        if (maxDate && dayjs(nextDate).isAfter(maxDate, "month")) return;
        increaseCurrentMonth();
      } else if (monthDiff < 0) {
        if (minDate && dayjs(nextDate).isBefore(minDate, "month")) return;
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
  };

  const handleFunctionKey = (
    e: React.KeyboardEvent,
    action: () => void
  ): void => {
    if (e.key === "Space" || e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  useEffect(() => {
    const width = containerRef.current?.offsetWidth ?? 0;
    const style = window.getComputedStyle(
      containerRef.current ?? document.createElement("div")
    );
    const _translateAmount = singleCalendar
      ? width + parseInt(style.marginLeft) - 8
      : width / 2;
    setWrapperWidth(_translateAmount);
  }, [containerRef.current, singleCalendar]);

  useEffect(() => {
    setFocusDate(fromDate ?? dayjs());
  }, [complsOpen, fromDate]);

  useEffect(() => {
    setDisablePrev(
      Boolean(
        minDate && focusDate.isBefore(dayjs(minDate).add(1, "month"), "month")
      )
    );
    setDisableNext(
      Boolean(
        maxDate &&
          focusDate.isAfter(dayjs(maxDate).subtract(2, "month"), "month")
      )
    );
    setMonthArray(getArrayMonth(focusDate));
  }, [focusDate, minDate, maxDate]);

  useEffect(() => {
    if (!dateChanged) return;

    if (dayjs(dateChanged).isBefore(focusDate, "month")) {
      decreaseCurrentMonth();
    } else if (dayjs(dateChanged).isAfter(focusDate.add(1, "month"), "month")) {
      increaseCurrentMonth();
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
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label="Calendar"
      >
        <div
          className={cx("calendar-content", { isAnimating })}
          style={{ transform: `translateX(${translateAmount}px)` }}
        >
          {monthArray.map((date, index) => {
            const monthKey = `${date.get("year")}-${date.get("month")}`;
            const isVisible = index === 1 || index === 2;
            const isSlidingNext = isAnimating && translateAmount < 0 && index === 3;
            const isSlidingPrev = isAnimating && translateAmount > 0 && index === 0;
            const isHidden = !isVisible && !isSlidingNext && !isSlidingPrev;

            return (
              <MonthCalendar
                key={monthKey}
                hidden={isHidden}
                isAnimating={isSlidingNext || isSlidingPrev}
                month={date.get("month")}
                year={date.get("year")}
                handleHoverDay={handleHoverDay}
                ref={tooltipRef}
                className={cx({
                  'slide-next': isSlidingNext,
                  'slide-prev': isSlidingPrev
                })}
              />
            );
          })}
        </div>
        <div className="calendar-flippers">
          <button
            className={cx("flipper-button", { disabled: disablePrev })}
            onClick={decreaseCurrentMonth}
            onKeyDown={(e) => handleFunctionKey(e, decreaseCurrentMonth)}
            disabled={disablePrev}
            aria-label="Previous month"
          >
            <PrevIcon viewBox="0 0 24 24" />
          </button>
          <button
            className={cx("flipper-button", { disabled: disableNext })}
            onClick={increaseCurrentMonth}
            onKeyDown={(e) => handleFunctionKey(e, increaseCurrentMonth)}
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