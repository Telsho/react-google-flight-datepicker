import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SingleDatePicker } from './SingleDatePicker';

describe('Dayjs Locale Formatting', () => {
  it('formats dates in German when locale="de"', async () => {
    const date = new Date(2026, 4, 15); // May 15, 2026
    await act(async () => {
      render(
        <SingleDatePicker
          startDate={date}
          dateFormat="MMMM D, YYYY"
          locale="de"
          onChange={() => {}}
          onCloseCalendar={() => {}}
        />
      );
    });

    // German May is "Mai"
    const elements = await screen.findAllByText(/Mai 15, 2026/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
