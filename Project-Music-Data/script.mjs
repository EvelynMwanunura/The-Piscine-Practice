// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIDs } from "./data.mjs";
import {
  renderMostListenedGenre,
  renderMostListenedSong,
  songListenedMostOnFridayNight,
  renderMostListenedArtist,
  mostTime,
  mostArtist,
} from "./common.mjs";

/*window.onload = function () {
  document.querySelector("body").innerText = `There are ${countUsers()} users`;
};
*/
const userSelect = document.getElementById("userSelect");
const table = document.getElementById("table");

const users = () => {
  const userID = getUserIDs();

  userID.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = `user ${user}`;
    userSelect.appendChild(option);
  });
};
const renderTable = () => {
  const table = document.createElement("table");

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Question", "Answers"];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  document.body.appendChild(table); // Or append where needed

  const tableBody = document.createElement("tbody");

  const data = {
    "Most listened song (count)": renderMostListenedSong(2),
    "Most listened song (time)": mostTime(2),
    "Most listened artist (count)": renderMostListenedArtist(2),
    "Most listened artist (time)": mostArtist(2),
    "Friday Night Song (count)": songListenedMostOnFridayNight(2),
    "Friday Night Song (time)": 0,
    "Longest streak song": 0,
    "Top 3 genres": renderMostListenedGenre(2),
  };
  Object.entries(data).forEach(([question, answer]) => {
    const row = document.createElement("tr");
    const questionCell = document.createElement("td");
    questionCell.textContent = question;

    const answerCell = document.createElement("td");
    answerCell.textContent = answer;
    row.appendChild(questionCell);
    row.appendChild(answerCell);
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
};

renderTable();

window.onload = users();
