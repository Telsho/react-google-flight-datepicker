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

  it('clears is-focus input highlighting on outside click in RangeDatePicker', async () => {
    const TestComponent = () => {
      const [startDate, setStartDate] = useState<Date | null>(new Date());
      const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));

      return (
        <div>
          <div data-testid="outside">Outside Area</div>
          <RangeDatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>
      );
    };

    const { container } = render(<TestComponent />);

    // Click the from-date input to open and focus
    const fromInput = container.querySelector('#from-date-input-button');
    expect(fromInput).not.toBeNull();
    fireEvent.click(fromInput!);

    // Check that it has 'is-focus' class while open
    expect(fromInput!).toHaveClass('is-focus');

    // Click outside to close
    await act(async () => {
      fireEvent.click(screen.getByTestId('outside'));
    });

    // Verify 'is-focus' class is removed after closing
    expect(fromInput!).not.toHaveClass('is-focus');
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
