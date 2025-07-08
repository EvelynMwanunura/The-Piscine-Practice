export async function fetchUserData(username) {
  const response = await fetch(
    `https://www.codewars.com/api/v1/users/${username}`
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  const data = await response.json();
  return data;
}
