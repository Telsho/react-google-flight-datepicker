import React from "react";
import {
  useDatePickerConfig,
  useDisplayCustomization,
} from "./DatePickerProvider";
import CalendarIcon from "../../assets/svg/calendar.svg";
import { DateInput } from "./DateInput";

interface DateInputGroupProps {
  showIcon?: boolean;
  nonFocusable?: boolean;
}

export const DateInputGroup: React.FC<DateInputGroupProps> = ({
  showIcon = false,
  nonFocusable = false,
}) => {
  const { isSingle } = useDatePickerConfig();
  const { dateInputSeperator } = useDisplayCustomization();

  return (
    <div className="date-picker-input">
      {showIcon && (
        <CalendarIcon className="icon-calendar mobile" viewBox="0 0 24 24" />
      )}
      <div className="date-picker-date-group">
        <DateInput
          type="from"
          tabIndex={nonFocusable ? -1 : 0}
          showIcon={showIcon}
          nonFocusable={nonFocusable}
        />
        {!isSingle && dateInputSeperator && (
          <div className="date-input-separator">{dateInputSeperator}</div>
        )}
        {!isSingle && (
          <DateInput
            type="to"
            tabIndex={nonFocusable ? -1 : 0}
            showIcon={showIcon}
            nonFocusable={nonFocusable}
          />
        )}
      </div>
    </div>
  );
};
