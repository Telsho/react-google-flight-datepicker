import BaseDatePicker, { BaseDatePickerProps } from "./BaseDatePicker";

// RangeDatePicker.tsx
export interface RangeDatePickerProps extends BaseDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
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
  startDatePlaceholder = 'Start date',
  endDatePlaceholder = 'End date',
  ...props
}) => (
  <BaseDatePicker
    {...props}
    isSingle={false}
    startDate={props.startDate}
    endDate={props.endDate}
    startDatePlaceholder={startDatePlaceholder}
    endDatePlaceholder={endDatePlaceholder}
    onChange={onChange}
    onCloseCalendar={onCloseCalendar}
  />
);