import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { SingleDatePicker } from './SingleDatePicker';

describe('<SingleDatePicker />', () => {
  it('closes an open calendar when the picker becomes disabled', async () => {
    const startDate = new Date(2026, 10, 12);
    const onChange = jest.fn();
    const props = { startDate, onChange };
    const { container, rerender } = render(<SingleDatePicker {...props} />);
    const input = container.querySelector('#from-date-input-button');

    fireEvent.click(input);
    expect(container.querySelector('.dialog-date-picker')).toHaveClass('open');

    rerender(<SingleDatePicker {...props} disabled />);
    expect(container.querySelector('.dialog-date-picker')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    rerender(<SingleDatePicker {...props} />);
    if (!container.querySelector('.dialog-date-picker.open')) {
      fireEvent.click(input);
    }
    const day = container.querySelector('.day[data-day-index="13"]');
    fireEvent.click(day);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should render', () => {
    const { container } = render(<SingleDatePicker startDate={null} />);

    expect(container).toBeDefined();
  });
});
