import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RangeDatePicker } from './RangeDatePicker';
import { SingleDatePicker } from './SingleDatePicker';

describe('Multi-language Examples and Usage', () => {
  it('Example 1: RangeDatePicker with automatic European locale translation (Spanish "es")', async () => {
    const Component = () => {
      const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 8, 1));
      const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 8, 10));

      return (
        <RangeDatePicker
          startDate={startDate}
          endDate={endDate}
          isOpen={true}
          locale="es"
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      );
    };

    await act(async () => {
      render(<Component />);
    });

    // Reset button in Spanish ("Restablecer")
    expect(screen.getAllByText('Restablecer').length).toBeGreaterThan(0);

    // Done button in Spanish ("Listo")
    expect(screen.getByText('Listo')).toBeInTheDocument();
  });

  it('Example 2: SingleDatePicker with custom label overrides via labels prop', async () => {
    const Component = () => {
      const [date, setDate] = useState<Date | null>(null);

      return (
        <SingleDatePicker
          startDate={date}
          isOpen={true}
          locale="tr"
          labels={{
            reset: 'Temizle',
            done: 'Tamam',
            singleDatePlaceholder: 'Tarih Seçin'
          }}
          onChange={(selectedDate) => setDate(selectedDate)}
        />
      );
    };

    await act(async () => {
      render(<Component />);
    });

    // Custom Reset button ("Temizle")
    expect(screen.getAllByText('Temizle').length).toBeGreaterThan(0);

    // Custom Done button ("Tamam")
    expect(screen.getByText('Tamam')).toBeInTheDocument();

    // Custom placeholder ("Tarih Seçin")
    expect(screen.getAllByText('Tarih Seçin').length).toBeGreaterThan(0);
  });
});
