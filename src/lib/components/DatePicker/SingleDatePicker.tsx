import React from "react";
import BaseDatePicker, { BaseDatePickerProps } from "./BaseDatePicker";
import { ClientOnly } from "./ClientOnly";

import { DatePickerLabels } from '../../translations';

export interface SingleDatePickerProps
  extends Omit<BaseDatePickerProps, 'startDate' | 'endDate' | 'onChange'> {
  startDate?: Date | null;
  startDatePlaceholder?: string;
  labels?: DatePickerLabels;
  resetText?: string;
  doneText?: string;
  onChange?: (startDate: Date | null) => void;
  onCloseCalendar?: (startDate: Date | null) => void;
}

export const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  onChange = () => {},
  onCloseCalendar = () => {},
  startDatePlaceholder = "",
  labels,
  resetText,
  doneText,
  ...props
}) => (
  <ClientOnly>
    <BaseDatePicker
      {...props}
      endDate={null}
      isSingle={true}
      startDate={props.startDate ?? null}
      startDatePlaceholder={startDatePlaceholder}
      labels={labels}
      resetText={resetText}
      doneText={doneText}
      onChange={(date) => onChange(date)}
      onCloseCalendar={(date) => onCloseCalendar(date)}
    />
  </ClientOnly>
);
