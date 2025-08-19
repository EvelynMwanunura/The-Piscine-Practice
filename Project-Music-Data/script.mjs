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
  mostTimeFriday,
  longestStreakSong,
  commonSong,
} from "./common.mjs";

const userSelect = document.getElementById("userSelect");
const tableElement = document.getElementById("table");

const users = () => {
  const userID = getUserIDs();

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a User";
  defaultOption.value = "";
  userSelect.appendChild(defaultOption);

  userID.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = `user ${user}`;
    userSelect.appendChild(option);
  });
};

userSelect.onchange = (e) => {
  e.preventDefault();
  const userID = userSelect.value;
  console.log("selected user is", userID);
  renderTable(userID);
};
users();

const renderTable = (userID) => {
  tableElement.innerHTML = "";
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

  const tableBody = document.createElement("tbody");

  const mostGenres = renderMostListenedGenre(userID);

  const data = {
    "Most listened song (count)": renderMostListenedSong(userID),
    "Most listened song (time)": mostTime(userID),
    "Most listened artist (count)": renderMostListenedArtist(userID),
    "Most listened artist (time)": mostArtist(userID),
    "Friday Night Song (count)": songListenedMostOnFridayNight(userID),
    "Friday Night Song (time)": mostTimeFriday(userID),
    "Everyday songs": commonSong(userID),
    "Longest streak song": longestStreakSong(userID),
  };

  if (mostGenres) {
    const genreLabel =
      mostGenres.length >= 3 ? "Top 3 genres" : "Most listened genre(s)";

    data[genreLabel] = mostGenres;
  }

  let hasData = false;
  Object.entries(data).forEach(([question, answer]) => {
    if (answer !== null) {
      hasData = true;
      const row = document.createElement("tr");
      const questionCell = document.createElement("td");
      questionCell.textContent = question;

      const answerCell = document.createElement("td");
      answerCell.textContent = answer;
      row.appendChild(questionCell);
      row.appendChild(answerCell);
      tableBody.appendChild(row);
    }
  });

  if (hasData) {
    table.appendChild(tableHeader);
  } else {
    const messageRow = document.createElement("tr");
    const messageCell = document.createElement("td");
    messageCell.colSpan = 2;
    messageCell.textContent = "No data available for the selected user.";
    messageRow.appendChild(messageCell);
    tableBody.appendChild(messageRow);
  }

  table.appendChild(tableBody);
  tableElement.appendChild(table);
};
