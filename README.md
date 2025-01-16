# react-google-flight-datepicker
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads][downloads-image]][downloads-url]

Google flight date picker implemented in ReactJS

### Demo
- Live demo: https://codesandbox.io/s/react-google-flight-datepicker-zultp
- To run demo on your computer:
  - Clone this repository
  - `yarn install`
  - `yarn run dev`

### Screenshot


#### Desktop
<video src="https://user-images.githubusercontent.com/1154740/199437644-560147f6-82db-4736-8ff9-fb6747a460a9.mov" width="500" autoplay></video>
----
#### Mobile
<video autoplay src="https://user-images.githubusercontent.com/1154740/199439704-c8cdb7db-8a6b-4f66-a3e0-f4b1f1fde10d.MOV" width="500"></video>

### Usage

##### RangeDatePicker
```jsx
import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';

<RangeDatePicker
  startDate={new Date()}
  endDate={new Date()}
  onChange={(startDate, endDate) => onDateChange(startDate, endDate)}
  minDate={new Date(1900, 0, 1)}
  maxDate={new Date(2100, 0, 1)}
  dateFormat="D"
  monthFormat="MMM YYYY"
  startDatePlaceholder="Start Date"
  endDatePlaceholder="End Date"
  disabled={false}
  className="my-own-class-name"
  startWeekDay="monday"
/>
```

##### SingleDatePicker
```jsx
import { SingleDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';

<SingleDatePicker
  startDate={new Date()}
  onChange={(startDate) => onDateChange(startDate)}
  minDate={new Date(1900, 0, 1)}
  maxDate={new Date(2100, 0, 1)}
  dateFormat="D"
  monthFormat="MMM YYYY"
  startDatePlaceholder="Date"
  disabled={false}
  className="my-own-class-name"
  startWeekDay="monday"
/>
```
##### Props
|Prop name |Prop type|Default value|Description|
|---------|---------|-------------|-----------|
startDate | Date | null | Selected start date |
endDate | Date | null | Selected end date |
dateFormat | String | D | Display format for date. Check momentjs doc for information (<a target="_blank" href="https://momentjs.com/docs/#/displaying/" class="jsx-1329640032" data-reactroot="">https://momentjs.com/docs/#/displaying/</a>) |
monthFormat | String | MMM YYYY | Display format for month. Check momentjs doc for information (<a target="_blank" href="https://momentjs.com/docs/#/displaying/" class="jsx-1329640032" data-reactroot="">https://momentjs.com/docs/#/displaying/</a>) |
onChange | Function | null | Event handler that is called when startDate and endDate are changed |
onFocus | Function | null | Return a string (START_DATE, END_DATE) which indicate which text input is focused |
minDate | Date | 1900 Jan 01 | Minimum date that user can select |
maxDate | Date | 2100 Jan 01 | Maximum date that user can select |
className | String |  | Custom CSS className for datepicker |
disabled | String | false | Disable the datepicker |
startDatePlaceholder | String | Start Date | Placeholder text for startDate text input |
endDatePlaceholder | String | End Date | Placeholder text for endDate text input |
startWeekDay | String (monday or sunday) | monday | Determine the start day for a week (monday or sunday) |
highlightToday | Bool | false | Hightlight "today" date
singleCalendar | Bool | false | Only applicable on SingleDatePicker. When this prop is actived, the datepicker will display 1 calendar instead of 2 calendar in the the container
tooltip | String, React Component, Function | | Display the tooltip when hovering on day element, you can pass string, component, or a function. The function will receive a Date object, so you can generate the content of tooltip.
subTextDict | Dict | null | Each key of the dict is a date in format YYYY-MM-DD, and the value is the text you want to display. You can see an example in dev/index.js. The text shouldn't be too big
expandDirection | String | "right" | if "right" the calendar will expand from the top left to the right if "left" it will expand from the top right to the left
locale | string | "fr", "it" .. | You can specify the locale, it should follow the locale formats from dayjs.

### Author
- David Tran - david@jslancer.com
- Elias Thouant 

### License
MIT

[package-url]: https://npmjs.org/package/react-google-flight-datepicker
[npm-version-svg]: http://versionbadg.es/jslancerteam/react-google-flight-datepicker.svg
[deps-svg]: https://david-dm.org/jslancerteam/react-google-flight-datepicker.svg
[deps-url]: https://david-dm.org/jslancerteam/react-google-flight-datepicker
[dev-deps-svg]: https://david-dm.org/jslancerteam/react-google-flight-datepicker/dev-status.svg
[dev-deps-url]: https://david-dm.org/jslancerteam/react-google-flight-datepicker#info=devDependencies
[downloads-image]: http://img.shields.io/npm/dm/react-google-flight-datepicker.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-google-flight-datepicker
