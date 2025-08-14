// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData, clearData } from "./storage.js";

/*window.onload = function () {
  const users = getUserIds();
  document.querySelector("body").innerText = `There are ${users.length} users`;
};*/

const userSelect = document.getElementById("userSelect");
const userDataSection = document.getElementById("userData");
const inputForm = document.getElementById("userForm");
const bookmarkTitle = document.getElementById("title");
const bookmarkDescription = document.getElementById("description");
const bookmarkUrl = document.getElementById("url");
const button = document.getElementById("submitBtn");

const getUsers = () => {
  const users = getUserIds();
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select user:";
  defaultOption.value = " ";
  userSelect.appendChild(defaultOption);

  users.forEach((user) => {
    const options = document.createElement("option");
    options.value = user;
    options.textContent = `User: ${user}`;
    userSelect.appendChild(options);
  });
};
getUsers();

userSelect.onchange = (e) => {
  e.preventDefault();

  const userID = userSelect.value;
  getUserData(userID);
};

const getUserData = (userID) => {
  userDataSection.innerHTML = "";
  let userData = getData(userID);

  if (!userID || userID.trim() === "") {
    userDataSection.innerHTML = "Please select a user.";
    return;
  }

  if (!userData || userData.length === 0) {
    userDataSection.innerHTML = "No data for user";
  } else userDataSection.innerHTML = userData;
};
