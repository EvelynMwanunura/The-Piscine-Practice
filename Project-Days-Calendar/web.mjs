// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

/*window.onload = function() {
    document.querySelector("body").innerText = `${getGreeting()} - there are ${daysData.length} known days`;
}*/

const calendarElement = document.getElementById("calendar");

const showCalendar = () => {
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",  "Sunday"]
const table = document.createElement("table");
const tableHead = document.createElement("thead")
const tableRow = document.createElement("tr")

for(let i = 0; i < weekdays.length; i++){
    const tableRowContents = document.createElement("th")
    tableRowContents.textContent = weekdays[i]
    tableRow.appendChild(tableRowContents)
}

tableHead.appendChild(tableRow)
table.appendChild(tableHead)
calendarElement.appendChild(table)

const currentDate = new Date();
console.log(currentDate)
const month = currentDate.getMonth()
console.log(month)
const year = currentDate.getFullYear()
console.log(year)
const date = currentDate.getDate()
console.log(date)
const firstDateOfMonth = new Date((month, year, 1))
const firstDayOfMonth = firstDateOfMonth.getDay()
console.log(firstDayOfMonth)
const lastDateOfMonth = new Date( year, month + 1, 0)

console.log(lastDateOfMonth.getDate())

const tableBody = document.createElement("tbody")
const row = tableBody.insertRow()
for(let i = 0; i < firstDayOfMonth; i ++ ){
   row.insertCell().textContent = "*"

   for(let j = 0; j < lastDateOfMonth; i++){
    if(row.cells.length === 7){
        tableBody.insertRow()
    }
    row.insertCell().textContent = i;


   }
   table.appendChild(tableBody);
    calendarElement.appendChild(table);
}



    
}


window.onload = showCalendar