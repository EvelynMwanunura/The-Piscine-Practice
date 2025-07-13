async function fetchUserData(username) {
  try {
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${username}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export const getUsers = async (username) => {
  const usernames = username.split(",").map((user) => user.trim());
  const promises = usernames.map(async (user) => {
    try {
      const data = await fetchUserData(user);
      return { user, data };
    } catch (error) {
      return { user, error: true };
    }
  });

  return await Promise.all(promises);
};
