import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

// Locale state interface
export interface LocaleState {
  currentLocale: string;
  isLocaleReady: boolean;
}

// Create contexts
const DateStateContext = createContext<DateState | null>(null);
const DatePickerConfigContext = createContext<DatePickerConfig | null>(null);
const UIStateContext = createContext<UIState | null>(null);
const DisplayContext = createContext<DisplayCustomization | null>(null);
const LocaleContext = createContext<LocaleState | null>(null);

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

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within DatePickerProvider');
  return context;
};

// Locale loader utility
const loadLocale = async (locale: string): Promise<boolean> => {
  if (locale === 'en') return true;
  try {
    await import(`dayjs/locale/${locale}.js`);
    return true;
  } catch (error) {
    console.error(`Failed to load locale ${locale}:`, error);
    return false;
  }
};

// Provider Props interface
export interface DatePickerProviderProps {
  children: React.ReactNode;
  dateState: DateState;
  config: DatePickerConfig;
  uiState: UIState;
  display: DisplayCustomization;
  locale?: string;
}

// Provider component
export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  children,
  dateState,
  config,
  uiState,
  display,
  locale = "en"
}) => {
  // Locale state
  const [localeState, setLocaleState] = useState<LocaleState>({
    currentLocale: "en",
    isLocaleReady: locale === "en"
  });

  // Load and set locale
  useEffect(() => {
    if (locale !== "en") {
      setLocaleState(prev => ({ ...prev, isLocaleReady: false }));
      loadLocale(locale)
        .then(success => {
          if (success) {
            dayjs.locale(locale);
            setLocaleState({
              currentLocale: locale,
              isLocaleReady: true
            });
          } else {
            dayjs.locale("en");
            setLocaleState({
              currentLocale: "en",
              isLocaleReady: true
            });
          }
        });
    } else {
      dayjs.locale("en");
      setLocaleState({
        currentLocale: "en",
        isLocaleReady: true
      });
    }
  }, [locale]);

  // Don't render until locale is ready
  if (!localeState.isLocaleReady) {
    return null; // Or a loading component
  }

  // Provide all contexts
  return (
    <LocaleContext.Provider value={localeState}>
      <DateStateContext.Provider value={dateState}>
        <DatePickerConfigContext.Provider value={config}>
          <UIStateContext.Provider value={uiState}>
            <DisplayContext.Provider value={display}>
              {children}
            </DisplayContext.Provider>
          </UIStateContext.Provider>
        </DatePickerConfigContext.Provider>
      </DateStateContext.Provider>
    </LocaleContext.Provider>
  );
};

export default DatePickerProvider;