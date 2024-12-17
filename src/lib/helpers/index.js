import dayjs from "dayjs";

export function getMonthInfo(year, month, startDay) {
  const weeks = [];
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const numDays = lastDate.getDate();

  let start = 1;
  let end = firstDate.getDay() === 0 ? 1 : 7 - firstDate.getDay() + 1;
  if (startDay === 'sunday') {
    end = 7 - firstDate.getDay();
  }
  while (start <= numDays) {
    weeks.push({ start, days: end - start + 1 });
    start = end + 1;
    end += 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
      end = numDays;
    }
  }

  return { totalWeek: weeks, totalDay: numDays };
}

export function getWeekDay(startWeekDay, weekDayFormat) {
  const days = [...Array(7)].map((_, i) => 
    dayjs().day(i).format(weekDayFormat === 'dd' ? 'dd' : 
                         weekDayFormat === 'ddd' ? 'ddd' : 'dddd')
  );

  if (startWeekDay === 'sunday') {
    const last = days.pop();
    days.unshift(last);
  }
  console.log(dayjs.locale())
  return days;
}
export function debounce(func, wait) {
  let timeout;

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args) {
    // The callback function to be executed after
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;

      // Execute the callback
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
}
