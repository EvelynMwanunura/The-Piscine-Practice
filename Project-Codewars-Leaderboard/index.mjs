// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

/*export function makeFetchRequest() {
  return fetch("https://example.com/test");
}*/
import { fetchUserData } from "./fetchAPI.mjs";

const usernameInput = document.getElementById("username");
const fetchButton = document.getElementById("btn");
/*
(async () => {
  const username = "CodeYourFuture";
  try {
    const userData = await fetchUserData(username);
    console.log("user Data", userData);
  } catch (err) {
    console.log("fetch failed", err);
  }
})();*/

fetchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;

  const users = await getUsers(username);
  renderTable(users);
  renderLanguages(users);

  usernameInput.value = "";
});

//function to get user data, first read the input, split it and map through it and call the API to fetch individuals data simultaneously and return data and throw an error if a user is not valid
const getUsers = async (username) => {
  const usernames = username.split(",").map((user) => user.trim());
  const promises = usernames.map(async (user) => {
    try {
      const data = await fetchUserData(user);
      return { user, data };
    } catch (error) {
      return { user, error: true };
    }
  });

  const userData = await Promise.all(promises);

  const validUsers = userData
    .filter((result) => !result.error)
    .map((result) => result.data);
  const inValidUsers = userData
    .filter((result) => result.error)
    .map((result) => result.user);

  if (inValidUsers.length > 0) {
    alert(`${inValidUsers.join(",")} , not found: `);
  }

  console.log(validUsers);
  return validUsers;
};

const renderTable = async (users) => {
  const table = document
    .getElementById("leaderboardTable")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = ""; // Clear existing rows

  users.forEach((user) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = user.username || "N/A";
    row.insertCell(1).textContent = user.clan || "N/A";
    row.insertCell(2).textContent = user.ranks?.overall?.score || 0;
  });
};

const renderLanguages = async (users) => {
  const langDiv = document.getElementById("lang");
  langDiv.innerHTML = "";
  const select = document.createElement("select");
  langDiv.append(select);
  const option = document.createElement("Option");
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
};
