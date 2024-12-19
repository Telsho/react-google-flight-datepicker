import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import { 
  useDateState, 
  useDatePickerConfig, 
  useUIState,
  useDisplayCustomization
} from './DatePickerProvider';
import BackIcon from '../../assets/svg/back.svg';
import {DateInputGroup} from './DateInputGroup';
import {DialogContentMobile} from './DialogContentMobile';
import {DialogContentDesktop} from './DialogContentDesktop';
import { Dayjs } from 'dayjs';

interface DialogContainerProps {
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const Dialog: React.FC<DialogContainerProps> = ({ 
  containerRef: externalRef 
}) => {
  const [hideAnimation, setHideAnimation] = useState(false);
  const [dateChanged, setDateChanged] = useState<Dayjs | null>(null);
  const defaultRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef || defaultRef;

  const {
    handleChangeDate,
    handleReset,
  } = useDateState();

  const {
    singleCalendar,
    expandDirection
  } = useDatePickerConfig();

  const {
    complsOpen,
    isMobile,
    toggleDialog
  } = useUIState();

  const {
    hideDialogHeader,
    hideDialogFooter,
  } = useDisplayCustomization();

  const onChangeDate = (date: Dayjs, type: 'from' | 'to') => {
    setDateChanged(date);
    handleChangeDate(date, type);
  };

  useEffect(() => {
    if (complsOpen && !hideAnimation) {
      setHideAnimation(true);
    }
    if (complsOpen) {
      setTimeout(() => {
        const startDateInput = containerRef.current?.querySelector(
          '#start-date-input-button'
        ) as HTMLElement;
        if (startDateInput) {
          startDateInput.focus();
        }
      }, 50);
    }
  }, [complsOpen, containerRef, hideAnimation]);

  return (
    <div
      className={cx('dialog-date-picker', {
        'open': complsOpen,
        'hide': !complsOpen && hideAnimation,
        'single': singleCalendar && !isMobile,
        'expand-left': expandDirection === 'left',
        'expand-right': expandDirection === 'right',
      })}
      ref={containerRef}
    >
      {!hideDialogHeader && (
        <div className="dialog-header">
          <button
            type="button"
            className="btn-outline back-button"
            onClick={toggleDialog}
          >
            <BackIcon viewBox="0 0 492 492" />
          </button>
          
          <DateInputGroup
            showIcon={false}
            nonFocusable={!complsOpen}
          />
          
          <button
            type="button"
            className="btn-outline reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}

      <div className="dialog-content">
        {isMobile ? (
          <DialogContentMobile />
        ) : (
          <DialogContentDesktop
            dateChanged={dateChanged}
          />
        )}
      </div>

      {!hideDialogFooter && (
        <div className="dialog-footer">
          <button
            type="button"
            className="submit-button"
            onClick={toggleDialog}
            tabIndex={0}
          >
            Done
          </button>
          <button
            type="button"
            className="btn-outline reset-button mobile"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};