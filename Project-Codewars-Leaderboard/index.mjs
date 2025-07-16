// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

/*export function makeFetchRequest() {
  return fetch("https://example.com/test");
}*/

import { getValidUsers } from "./getValidUsers.mjs";
import { sortUsers, getUserScore } from "./sortUsers.mjs";

const usernameInput = document.getElementById("username");
const fetchButton = document.getElementById("btn");

let selectedLanguage = "";
let allUsers = [];

fetchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;

  const users = await getValidUsers(username);
  allUsers = users;
  renderTable(allUsers, selectedLanguage);

  if (allUsers.length > 0) {
    renderLanguages(allUsers);
  } else {
    // Clear the language dropdown if no valid users
    const langDiv = document.getElementById("lang");
    langDiv.innerHTML = "";
  }

  usernameInput.value = "";
});

const renderTable = async (users, language = selectedLanguage) => {
  const table = document
    .getElementById("leaderboardTable")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = ""; // Clear existing rows

  const filteredUsers = sortUsers(users, language);

  filteredUsers.forEach((user, index) => {
    const row = table.insertRow();

    row.insertCell(0).textContent = user.username || "N/A";
    row.insertCell(1).textContent = user.clan || "N/A";
    const score = getUserScore(user, language) || "N/A";
    row.insertCell(2).textContent = index === 0 ? `${score} 🎉🎉` : score;
  });
};

export const renderLanguages = async (users) => {
  const langDiv = document.getElementById("lang");
  langDiv.innerHTML = "";
  const select = document.createElement("select");
  langDiv.append(select);
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "Overall";
  select.append(option);
  const languageSet = new Set();
  users.forEach((user) => {
    const languages = user.ranks?.languages;
    if (languages) {
      Object.keys(languages).forEach((lang) => languageSet.add(lang));
    }
  });

  const languageArray = Array.from(languageSet).sort();

  for (const language of languageArray) {
    const languageOption = document.createElement("option");
    languageOption.textContent = language;
    languageOption.value = language;
    select.append(languageOption);
  }

  select.addEventListener("change", (e) => {
    e.preventDefault();
    selectedLanguage = e.target.value;

    renderTable(allUsers, selectedLanguage);
  });
};
