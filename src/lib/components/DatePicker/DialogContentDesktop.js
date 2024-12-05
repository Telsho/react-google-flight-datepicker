import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import dayjs from "dayjs";

import PrevIcon from "../../assets/svg/prev.svg";
import NextIcon from "../../assets/svg/next.svg";
import MonthCalendar from "./MonthCalendar";

const DialogContentDesktop = ({
  fromDate = null,
  toDate = null,
  hoverDate = null,
  onSelectDate = () => {},
  onHoverDate = () => {},
  startWeekDay = null,
  minDate = null,
  maxDate = null,
  monthFormat = "",
  isSingle = false,
  complsOpen = false,
  dateChanged = null,
  highlightToday = false,
  singleCalendar = false,
  weekDayFormat = "",
  tooltip = "",
  subTextDict = null,
}) => {
  const containerRef = useRef();
  const tooltipRef = useRef();
  const [translateAmount, setTranslateAmount] = useState(0);
  const [monthArray, setMonthArray] = useState([]);
  const [focusDate, setFocusDate] = useState(dayjs());
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [dayValue, setDayValue] = useState(0);

  function getArrayMonth(date, singleCalendar) {
    const prevMonth = dayjs(date).subtract(1, "month");
    const nextMonth = dayjs(date).add(1, "month");
    const futureMonth = dayjs(date).add(2, "month");

    if (singleCalendar) {
      return [prevMonth, focusDate, nextMonth];
    }

    return [prevMonth, focusDate, nextMonth, futureMonth];
  }

  const handleHoverDay = useCallback((date) => {
    setDayValue(date);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const style = window.getComputedStyle(containerRef.current);
      const _translateAmount = singleCalendar
        ? containerRef.current.offsetWidth + parseInt(style.marginLeft) - 8
        : containerRef.current.offsetWidth / 2;
      setWrapperWidth(_translateAmount);
    }
  }, [containerRef.current]);

  useEffect(() => {
    setFocusDate(fromDate || dayjs());
  }, [complsOpen]);

  useEffect(() => {
    if (
      minDate &&
      focusDate.isBefore(dayjs(minDate).add(1, "month"), "month")
    ) {
      setDisablePrev(true);
    } else {
      setDisablePrev(false);
    }

    if (
      maxDate &&
      focusDate.isAfter(dayjs(maxDate).subtract(2, "month"), "month")
    ) {
      setDisableNext(true);
    } else {
      setDisableNext(false);
    }

    const arrayMonth = getArrayMonth(focusDate, singleCalendar);
    setMonthArray(arrayMonth);
  }, [focusDate]);

  function increaseFocusDate(date) {
    if (dayjs.isDayjs(date)) {
      setFocusDate(date);
    } else {
      const nextDate = dayjs(focusDate).add(1, "month");
      setFocusDate(nextDate);
    }
  }

  function decreaseFocusDate(date) {
    if (dayjs.isDayjs(date)) {
      setFocusDate(date);
    } else {
      const prevDate = dayjs(focusDate).subtract(1, "month");
      setFocusDate(prevDate);
    }
  }

  function increaseCurrentMonth(date) {
    if (disableNext) return;

    setTranslateAmount(-wrapperWidth);
    setTimeout(() => {
      increaseFocusDate(date);
      setTranslateAmount(0);
    }, 200);
  }

  function decreaseCurrentMonth(date) {
    if (disablePrev) return;

    setTranslateAmount(wrapperWidth);
    setTimeout(() => {
      decreaseFocusDate(date);
      setTranslateAmount(0);
    }, 200);
  }

  useEffect(() => {
    if (dateChanged) {
      if (dayjs(dateChanged).isBefore(focusDate, "month", true)) {
        decreaseCurrentMonth(dateChanged);
      }
      if (
        dayjs(dateChanged).isAfter(focusDate.add(1, "month"), "month", true)
      ) {
        increaseCurrentMonth(dayjs(dateChanged).subtract(1, "month"));
      }
    }
  }, [dateChanged]);

  function onBackButtonKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      decreaseCurrentMonth();

      return false;
    }
  }

  function onNextButtonKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      increaseCurrentMonth();

      return false;
    }
  }

  function focusOnCalendar() {
    if (containerRef && containerRef.current) {
      let selectedButton = containerRef.current.querySelector(".day.selected");
      if (!selectedButton) {
        selectedButton = containerRef.current.querySelector(
          ".month-calendar:not(.hidden) .day:not(.disabled)"
        );
      }
      if (selectedButton) {
        selectedButton.focus();
      }
    }
  }

  function onKeyDown(e) {
    const allowKeyCodes = [9, 32, 37, 38, 39, 40];
    if (
      allowKeyCodes.indexOf(e.keyCode) === -1 ||
      !e.target.getAttribute("data-day-index")
    ) {
      return true;
    }

    e.preventDefault();

    const calendarContainer =
      e.target.parentElement.parentElement.parentElement.parentElement;
    const dayIndex = parseInt(e.target.getAttribute("data-day-index"));
    const dateValue = parseInt(e.target.getAttribute("data-date-value"));
    const date = dayjs(dateValue);
    const lastDateOfMonth = date.add(1, "month").set("date", 0).get("date");
    let nextDayIndex = -1;
    let increaseAmount = 0;

    switch (e.keyCode) {
      case 9: {
        const doneButton =
          calendarContainer.parentElement.parentElement.parentElement.querySelector(
            ".submit-button"
          );
        if (doneButton) {
          doneButton.focus();

          return true;
        }
        break;
      }
      case 32:
        e.target.click();
        break;
      case 37:
        increaseAmount = -1;
        break;
      case 38:
        increaseAmount = -7;
        break;
      case 39:
        increaseAmount = 1;
        break;
      case 40:
        increaseAmount = 7;
        break;
      default:
        break;
    }

    nextDayIndex = dayIndex + increaseAmount;
    if (nextDayIndex > 0 && nextDayIndex <= lastDateOfMonth) {
      const selector = `.day[data-day-index="${nextDayIndex}"]`;
      const dayElement =
        e.target.parentElement.parentElement.querySelector(selector);
      if (dayElement) {
        dayElement.focus();
      }
    } else {
      const nextDate = date.add(increaseAmount, "day");

      if (
        increaseAmount > 0 &&
        Math.ceil(nextDate.diff(focusDate, "month", true)) > 1
      ) {
        if (maxDate && dayjs(nextDate).isAfter(maxDate, "month")) return false;
        increaseCurrentMonth();
      } else if (
        increaseAmount < 0 &&
        Math.ceil(focusDate.diff(nextDate, "month", true)) > 0
      ) {
        if (minDate && dayjs(nextDate).isBefore(minDate, "month")) return false;
        decreaseCurrentMonth();
      }
      setTimeout(() => {
        const query = `.month-calendar[data-month-index="${
          nextDate.get("month") + 1
        }"] .day[data-day-index="${nextDate.get("date")}"]`;
        const dayElement = calendarContainer.querySelector(query);
        if (dayElement) {
          dayElement.focus();
        }
      }, 200);
    }

    return false;
  }

  function renderMonthCalendars() {
    return monthArray.map((date, dateIndex) => (
      <MonthCalendar
        // eslint-disable-next-line react/no-array-index-key
        key={dateIndex}
        hidden={dateIndex === 0 && translateAmount <= 0}
        isAnimating={dateIndex === 0 && translateAmount > 0}
        month={dayjs(date).get("month")}
        year={dayjs(date).get("year")}
        onSelectDate={onSelectDate}
        onHoverDate={onHoverDate}
        fromDate={fromDate}
        toDate={toDate}
        hoverDate={hoverDate}
        startWeekDay={startWeekDay}
        minDate={minDate}
        maxDate={maxDate}
        weekDayFormat={weekDayFormat}
        monthFormat={monthFormat}
        isSingle={isSingle}
        highlightToday={highlightToday}
        singleCalendar={singleCalendar}
        handleHoverDay={handleHoverDay}
        subTextDict={subTextDict}
        ref={tooltipRef}
      />
    ));
  }

  return (
    <div style={{ position: "relative" }}>
      {tooltip && (
        <div id="day-tooltip" className="tooltip-text" ref={tooltipRef}>
          {typeof tooltip === "function"
            ? tooltip(dayValue.$d ? new Date(dayValue.$d) : new Date())
            : tooltip}
        </div>
      )}
      <div
        className={cx("calendar-wrapper", {
          single: singleCalendar,
        })}
        ref={containerRef}
        onKeyDown={onKeyDown}
      >
        <div
          className={cx("calendar-content", {
            isAnimating: translateAmount !== 0,
            single: singleCalendar,
          })}
          style={{
            transform: `translateX(${translateAmount}px)`,
          }}
        >
          {renderMonthCalendars()}
        </div>
        <div className="calendar-flippers">
          <div
            className={cx("flipper-button", { disabled: disablePrev })}
            onClick={decreaseCurrentMonth}
            onKeyDown={onBackButtonKeyDown}
            role="button"
            tabIndex="0"
          >
            <PrevIcon viewBox="0 0 24 24" />
          </div>
          <div
            className={cx("flipper-button", { disabled: disableNext })}
            onClick={increaseCurrentMonth}
            onKeyDown={onNextButtonKeyDown}
            role="button"
            tabIndex="0"
            onBlur={focusOnCalendar}
          >
            <NextIcon viewBox="0 0 24 24" />
          </div>
        </div>
      </div>
    </div>
  );
};

DialogContentDesktop.propTypes = {
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  onSelectDate: PropTypes.func,
  onHoverDate: PropTypes.func,
  startWeekDay: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  monthFormat: PropTypes.string,
  isSingle: PropTypes.bool,
  complsOpen: PropTypes.bool,
  dateChanged: PropTypes.instanceOf(Date),
  highlightToday: PropTypes.bool,
  singleCalendar: PropTypes.bool,
  weekDayFormat: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  subTextDict: PropTypes.object,
};

export default DialogContentDesktop;
