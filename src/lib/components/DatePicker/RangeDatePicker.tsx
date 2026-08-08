import React from "react";
import BaseDatePicker, { BaseDatePickerProps } from "./BaseDatePicker";

import { ClientOnly } from "./ClientOnly";

import { DatePickerLabels } from "../../translations";

export interface RangeDatePickerProps extends BaseDatePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  labels?: DatePickerLabels;
  resetText?: string;
  doneText?: string;
  onChange?: (startDate: Date | null, endDate: Date | null) => void;
  onCloseCalendar?: (startDate: Date | null, endDate: Date | null) => void;
  dateInputSeperator?: React.ReactNode;
  hideDialogHeader?: boolean;
  hideDialogFooter?: boolean;
  hideDialogAfterSelectEndDate?: boolean;
}

export const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  onChange = () => {},
  onCloseCalendar = () => {},
  startDatePlaceholder = "",
  endDatePlaceholder = "",
  labels,
  resetText,
  doneText,
  ...props
}) => (
  <ClientOnly>
    <BaseDatePicker
      {...props}
      isSingle={false}
      startDate={props.startDate ?? null}
      endDate={props.endDate ?? null}
      startDatePlaceholder={startDatePlaceholder}
      endDatePlaceholder={endDatePlaceholder}
      labels={labels}
      resetText={resetText}
      doneText={doneText}
      onChange={onChange}
      onCloseCalendar={onCloseCalendar}
    />
  </ClientOnly>
);
