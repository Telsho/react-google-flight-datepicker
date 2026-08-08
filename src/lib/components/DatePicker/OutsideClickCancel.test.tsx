import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RangeDatePicker } from './RangeDatePicker';
import { SingleDatePicker } from './SingleDatePicker';

describe('Outside click / exit behavior', () => {
  it('persists selected date on outside click in RangeDatePicker', async () => {
    let currentStart: Date | null = new Date();
    let currentEnd: Date | null = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    const TestComponent = () => {
      const [startDate, setStartDate] = useState<Date | null>(currentStart);
      const [endDate, setEndDate] = useState<Date | null>(currentEnd);

      return (
        <div>
          <div data-testid="outside">Outside Area</div>
          <RangeDatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              currentStart = start;
              currentEnd = end;
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>
      );
    };

    render(<TestComponent />);

    // Open datepicker
    const dateButtons = screen.getAllByRole('button', { name: /Sat|Sun|Mon|Tue|Wed|Thu|Fri/i });
    fireEvent.click(dateButtons[0]);

    // Select day 20
    const day20Buttons = screen.getAllByText('20');
    fireEvent.click(day20Buttons[0]);

    // Fast-forward debounce timer for notifyChange
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    // Click outside to exit
    await act(async () => {
      fireEvent.click(screen.getByTestId('outside'));
    });

    // Verify state was updated to 20th
    expect(currentStart?.getDate()).toBe(20);
  });

  it('persists selected date on outside click in SingleDatePicker', async () => {
    let currentStart: Date | null = new Date();

    const TestComponent = () => {
      const [startDate, setStartDate] = useState<Date | null>(currentStart);

      return (
        <div>
          <div data-testid="outside">Outside Area</div>
          <SingleDatePicker
            startDate={startDate}
            hideDialogAfterSelectEndDate={false}
            onChange={(start) => {
              currentStart = start;
              setStartDate(start);
            }}
          />
        </div>
      );
    };

    render(<TestComponent />);

    // Open datepicker
    const dateButtons = screen.getAllByRole('button', { name: /Sat|Sun|Mon|Tue|Wed|Thu|Fri/i });
    fireEvent.click(dateButtons[0]);

    // Select day 20
    const day20Buttons = screen.getAllByText('20');
    fireEvent.click(day20Buttons[0]);

    // Fast-forward debounce timer
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    // Click outside
    await act(async () => {
      fireEvent.click(screen.getByTestId('outside'));
    });

    expect(currentStart?.getDate()).toBe(20);
  });
});
