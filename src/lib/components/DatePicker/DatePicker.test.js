import React from 'react';
import { render } from '@testing-library/react';

import { SingleDatePicker } from './SingleDatePicker';

describe('<SingleDatePicker />', () => {
  it('should render', () => {
    const { container } = render(<SingleDatePicker startDate={null} />);

    expect(container).toBeDefined();
  });
});
