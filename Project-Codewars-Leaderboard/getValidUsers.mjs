//function to get user data, first read the input, split it and map through it and call the API to fetch individuals data simultaneously and return data and throw an error if a user is not valid
import { getUsers } from "./fetchAPI.mjs";

export const getValidUsers = async (username) => {
  const userData = await getUsers(username);
  const validUsers = userData
    .filter((result) => !result.error)
    .map((result) => result.data);
  const inValidUsers = userData
    .filter((result) => result.error)
    .map((result) => result.user);

  if (inValidUsers.length > 0) {
    alert(`Username "${inValidUsers.join(", ")}" is not found.`);
  }

  if (validUsers.length === 0) {
    // Clear language dropdown if no valid users at all
    const langDiv = document.getElementById("lang");
    langDiv.innerHTML = "";
  }

  return validUsers;
};
