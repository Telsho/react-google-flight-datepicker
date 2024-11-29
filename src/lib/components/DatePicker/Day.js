import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const Day = forwardRef(
  (
    {
      dateIndex = null,
      dateValue = null,
      isEndDay = false,
      selected = false,
      hovered = false,
      disabled = false,
      onSelectDate = () => {},
      onHoverDate = () => {},
      totalDay = null,
      highlight = false,
      handleHoverDay = () => {},
      subText = "",
    },
    ref
  ) => {
    const dayRef = useRef();

    function selectDate(e) {
      e.stopPropagation();
      e.preventDefault();
      if (disabled) return;
      onSelectDate(dateValue);
    }

    function handleHoverDate() {
      if (disabled || !onHoverDate) return;
      onHoverDate(dateValue);
      handleHoverDay(dateValue);
    }

    const handleTooltipPosition = useCallback(() => {
      const element = ref.current;
      if (element) {
        element.style.left = `${
          dayRef.current.offsetLeft - element.offsetWidth + 135
        }px`;
        element.style.top = `${
          dayRef.current.offsetTop - element.offsetHeight - 15
        }px`;
        element.style.visibility = "visible";
      }
    }, []);

    const handleTooltipHidden = useCallback(() => {
      const element = ref.current;
      if (element) {
        element.style.visibility = "hidden";
      }
    }, []);

    useEffect(() => {
      if (dayRef.current) {
        dayRef.current.addEventListener("mouseover", handleTooltipPosition);
        dayRef.current.addEventListener("mouseleave", handleTooltipHidden);
      }
      return () => {
        document.removeEventListener("mouseover", handleTooltipPosition);
        document.removeEventListener("mouseleave", handleTooltipHidden);
      };
    }, [dayRef]);

    return (
      <div
        className={cx("day", {
          selected,
          hovered,
          disabled,
          highlight,
          end: isEndDay,
          "has-subtext": !!subText,
        })}
        onClick={selectDate}
        onMouseEnter={handleHoverDate}
        role="button"
        tabIndex="-1"
        data-day-index={dateIndex}
        data-date-value={dateValue}
        ref={dayRef}
      >
        {hovered &&
          !(isEndDay && dateIndex === totalDay) &&
          !(dateIndex === 1 && selected && !isEndDay) && (
            <div
              className={cx("background-day", {
                "first-day": dateIndex === 1,
                "last-day": dateIndex === totalDay,
              })}
            />
          )}
        <div className="day-content">
          <div className="text-day">{dateIndex}</div>
          {subText && (
            <div
              className="sub-text"
              style={{
                position: "relative",
                zIndex: 3,
                color: (selected && !hovered) ? "#fff" : "#666",
              }}
            >
              {subText}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Day.propTypes = {
  dateIndex: PropTypes.number,
  dateValue: PropTypes.string,
  isEndDay: PropTypes.bool,
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  disabled: PropTypes.bool,
  onSelectDate: PropTypes.func,
  onHoverDate: PropTypes.func,
  totalDay: PropTypes.number,
  highlight: PropTypes.bool,
  handleHoverDay: PropTypes.func,
  subText: PropTypes.string,
};

export default Day;
