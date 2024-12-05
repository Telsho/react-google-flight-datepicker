/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import dayjs from "dayjs";

import Day from "./Day";

const Week = forwardRef(
  (
    {
      isFirst = false,
      week = {},
      month = null,
      year = null,
      fromDate = null,
      toDate = null,
      totalDay = null,
      hoverDate = null,
      onSelectDate = () => {},
      onHoverDate = () => {},
      minDate = null,
      maxDate = null,
      isSingle = false,
      weekIndex = 0,
      highlightToday = false,
      handleHoverDay = () => {},
      subTextDict = null,
    },
    ref
  ) => {
    function generateDay() {
      return [...Array(week.days).keys()].map((index) => {
        const dateIndex = index + week.start;
        const dateValue = dayjs(`${year}-${month + 1}-${dateIndex}`);
        const disabled =
          (minDate && dateValue.isBefore(minDate, "date")) ||
          (maxDate && dateValue.isAfter(maxDate, "date"));
        const selected =
          dateValue.isSame(fromDate, "date") ||
          dateValue.isSame(toDate, "date");
        let hovered = false;
        const highlight =
          highlightToday && dateValue.isSame(new Date(), "date");

        if (fromDate && !fromDate.isSame(toDate, "date") && !isSingle) {
          if (
            toDate &&
            !fromDate.isAfter(dateValue, "date") &&
            !toDate.isBefore(dateValue, "date")
          ) {
            hovered = true;
          }
          if (
            !toDate &&
            !dateValue.isBefore(fromDate, "date") &&
            !(hoverDate && hoverDate.isBefore(dateValue, "date")) &&
            fromDate.isBefore(hoverDate, "date")
          ) {
            hovered = true;
          }
        }

        let isEndDate = false;
        if (
          dateValue.isSame(toDate, "date") ||
          (!toDate && dateValue.isSame(hoverDate, "date"))
        ) {
          isEndDate = true;
        }

        const subText =
          subTextDict === null
            ? ""
            : subTextDict[dateValue.format("YYYY-MM-DD")] ?? "\u00A0";

        return (
          <Day
            key={index}
            dateIndex={dateIndex}
            dateValue={dateValue}
            hoverDate={hoverDate}
            onSelectDate={onSelectDate}
            onHoverDate={onHoverDate}
            selected={selected}
            hovered={hovered}
            highlight={highlight}
            disabled={disabled}
            isEndDay={isEndDate}
            totalDay={totalDay}
            weekDayIndex={index}
            weekIndex={weekIndex}
            handleHoverDay={handleHoverDay}
            subText={subText}
            ref={ref}
          />
        );
      });
    }

    return (
      <div className={cx("week", { first: isFirst })}>{generateDay()}</div>
    );
  }
);

Week.propTypes = {
  isFirst: PropTypes.bool,
  week: PropTypes.object,
  month: PropTypes.number,
  year: PropTypes.number,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  hoverDate: PropTypes.instanceOf(Date),
  totalDay: PropTypes.number,
  onSelectDate: PropTypes.func,
  onHoverDate: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  isSingle: PropTypes.bool,
  weekIndex: PropTypes.number,
  highlightToday: PropTypes.bool,
  handleHoverDay: PropTypes.func,
  subTextDict: PropTypes.object,
};


export default Week;
