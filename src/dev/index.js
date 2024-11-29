import React from 'react';
import { createRoot } from 'react-dom/client';
import { RangeDatePicker, SingleDatePicker } from '../lib';
import '../lib/components/DatePicker/styles.scss';
import dayjs from 'dayjs';

export default function App() {

    const subTextDict = {
      [dayjs().format('YYYY-MM-DD')]: "500$",
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: "543$",
      [dayjs().add(2, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(3, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(4, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(5, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(6, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(7, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(8, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(9, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(10, 'day').format('YYYY-MM-DD')]: "94$",
      [dayjs().add(11, 'day').format('YYYY-MM-DD')]: "940$",
    };

    console.log(subTextDict);

    return (
      <div className="App">
        <h1>react-google-flight-datepicker</h1>
        <h2>Install</h2>
        <pre>
          npm install react-google-flight-datepicker
          <br />
          <br />
          yarn add react-google-flight-datepicker
        </pre>
        <h2>RangeDatePicker</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 1)}
        />
        <br />
        <h2>SingleDatePicker</h2>
        <SingleDatePicker startDate={new Date(2020, 0, 15)} />
        <h2>RangeDatePicker with startDate and endDate</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 1)}
          endDate={new Date(2020, 1, 1)}
        />
        <br />
        <h2>RangeDatePicker with minDate and maxDate</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 8)}
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date(2020, 1, 5)}
        />
        <br />
        <h2>RangeDatePicker with custom date format</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 1)}
          dateFormat="D"
        />
        <h2>RangeDatePicker with custom month format</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 1)}
          monthFormat="MMMM"
        />
        <br />
  
        <h2>Disabled RangeDatePicker</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 1)}
          disabled
        />
        <br />
  
        <h2>Custom placeholder</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 1)}
          startDatePlaceholder="From"
          endDatePlaceholder="To"
        />
        <br />
  
        <h2>Highlight today</h2>
        <RangeDatePicker
          startDate={new Date(2020, 0, 15)}
          endDate={new Date(2020, 1, 1)}
          startDatePlaceholder="From"
          endDatePlaceholder="To"
          highlightToday
        />



        <h2>Subtext</h2>
        <RangeDatePicker
          startDate={new Date()}
          endDate={new Date().getDate() + 15}
          startDatePlaceholder="From"
          endDatePlaceholder="To"
          subTextDict={subTextDict}
        />
        <br />
      </div>
    );
  };

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);