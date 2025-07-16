export const sortUsers = (users, language) => {
  const filteredUsers = users.filter(
    (user) => getUserScore(user, language) !== undefined
  );

  filteredUsers.sort((a, b) => {
    const scoreA =
      language && language !== ""
        ? a.ranks.languages[language].score
        : a.ranks.overall.score;
    const scoreB =
      language && language !== ""
        ? b.ranks.languages[language].score
        : b.ranks.overall.score;

    return scoreB - scoreA;
  });

  return filteredUsers;
};

export const getUserScore = (user, language) => {
  return language
    ? user.ranks?.languages?.[language]?.score
    : user.ranks?.overall?.score;
};
