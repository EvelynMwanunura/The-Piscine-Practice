// This is a placeholder file which shows how you can define functions which can be used from both a browser script and a node script. You can delete the contents of the file once you have understood how it works.

export function getGreeting() {
  return "Hello";
}

export function getTheNthOccurrence(occurrence, weekday, month) {
  let occurrenceMap = ["first", "second", "third", "fourth"];

  const monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDayMap = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const date = new Date();
  month = date.getMonth();
  const year = date.getFullYear();

  const firstDateOfMonth = new Date(month, year, 1);
  console.log(firstDateOfMonth);
  const firstDayOfMonth = firstDateOfMonth.getDay();
}
