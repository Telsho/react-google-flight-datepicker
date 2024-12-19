import React, { createContext, useContext, useState, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { SubTextDict } from './BaseDatePicker';

// Core date state and handlers
export interface DateState {
  fromDate?: Dayjs;
  toDate?: Dayjs;
  hoverDate?: Dayjs;
  inputFocus: 'from' | 'to' | null;
  onSelectDate: (date: Dayjs) => void;
  onHoverDate: (date: Dayjs) => void;
  handleChangeDate: (date: Dayjs, type: 'from' | 'to') => void;
  handleReset: () => void;
  handleClickDateInput: (type: 'from' | 'to') => void;
}

// Configuration that rarely changes
export interface DatePickerConfig {
  isSingle: boolean;
  startWeekDay: 'monday' | 'sunday';
  minDate: Date | null;
  maxDate: Date | null;
  weekDayFormat: string;
  dateFormat: string;
  monthFormat: string;
  highlightToday: boolean;
  singleCalendar?: boolean;
  expandDirection: string;
  locale: string;
}

// UI-specific state
export interface UIState {
  complsOpen: boolean;
  isMobile: boolean;
  disabled: boolean;
  toggleDialog: () => void;
}

// Display customization
export interface DisplayCustomization {
  startDatePlaceholder: string;
  endDatePlaceholder?: string;
  dateInputSeperator?: React.ReactNode;
  hideDialogHeader: boolean;
  hideDialogFooter: boolean;
  hideDialogAfterSelectEndDate: boolean;
  tooltip?: string | React.ReactNode | ((date: Date) => React.ReactNode);
  subTextDict?: SubTextDict | null;
}

const DateStateContext = createContext<DateState | null>(null);
const DatePickerConfigContext = createContext<DatePickerConfig | null>(null);
const UIStateContext = createContext<UIState | null>(null);
const DisplayContext = createContext<DisplayCustomization | null>(null);

// Custom hooks
export const useDateState = () => {
  const context = useContext(DateStateContext);
  if (!context) throw new Error('useDateState must be used within DatePickerProvider');
  return context;
};

export const useDatePickerConfig = () => {
  const context = useContext(DatePickerConfigContext);
  if (!context) throw new Error('useDatePickerConfig must be used within DatePickerProvider');
  return context;
};

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) throw new Error('useUIState must be used within DatePickerProvider');
  return context;
};

export const useDisplayCustomization = () => {
  const context = useContext(DisplayContext);
  if (!context) throw new Error('useDisplayCustomization must be used within DatePickerProvider');
  return context;
};

// Provider component
export interface DatePickerProviderProps {
  children: React.ReactNode;
  dateState: DateState;
  config: DatePickerConfig;
  uiState: UIState;
  display: DisplayCustomization;
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  children,
  dateState,
  config,
  uiState,
  display,
}) => (
  <DateStateContext.Provider value={dateState}>
    <DatePickerConfigContext.Provider value={config}>
      <UIStateContext.Provider value={uiState}>
        <DisplayContext.Provider value={display}>
          {children}
        </DisplayContext.Provider>
      </UIStateContext.Provider>
    </DatePickerConfigContext.Provider>
  </DateStateContext.Provider>
);