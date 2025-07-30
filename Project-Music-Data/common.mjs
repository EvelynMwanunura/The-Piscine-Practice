import { getSong, getListenEvents } from "./data.mjs";

const getFullSongData = (userID) => {
  const events = getListenEvents(userID) || [];
  const songMap = {};
  const fullSongs = [];

  events.forEach(({ song_id }) => {
    if (!songMap[song_id]) {
      songMap[song_id] = getSong(song_id);
    }
    fullSongs.push(songMap[song_id]);
  });

  return fullSongs;
};

export const renderSongs = (userID) => {
  const fullSongs = getFullSongData(userID);
  return fullSongs.length ? fullSongs : null;
};
/////////////////////////////////////////////////////////
const renderSongsByDate = (userID) => {
  const songs = getListenEvents(userID);

  return songs.reduce((acc, song) => {
    const date = song.timestamp.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(song);
    return acc;
  }, {});
};

export const commonSong = (userID) => {
  const songsByDate = renderSongsByDate(userID);

  const dailySong = Object.values(songsByDate).map(
    (songs) => new Set(songs.map((song) => song.song_id))
  );

  if (dailySong.length === 0) return null;

  const commonSong = [
    ...dailySong.reduce((common, daySong) => {
      return new Set([...common].filter((songID) => daySong.has(songID)));
    }),
  ];

  if (commonSong.length === 0) return null;

  const songsWithArtist = commonSong.map((songID) => {
    const song = getSong(songID);
    return `${song.artist} - ${song.title}`;
  });

  return songsWithArtist;
};

export const renderMostListenedArtist = (userID) => {
  const songs = renderSongs(userID);
  if (!songs) return null;

  const count = songs.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(count).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
};

export const renderMostListenedGenre = (userID) => {
  const songs = renderSongs(userID);
  if (!songs) return null;

  const genreCount = songs.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1;
    return acc;
  }, {});

  const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  return {
    genres: sortedGenres.join(", "),
    count: Object.keys(genreCount).length,
  };
};

export const renderMostListenedSong = (userID) => {
  const listenedSongs = renderSongs(userID) || [];
  if (!listenedSongs || listenedSongs.length === 0) {
    return null;
  } else {
    let mostListenedSong = {};
    listenedSongs.forEach((song) => {
      mostListenedSong[song.id] = (mostListenedSong[song.id] || 0) + 1;
    });

    let mostListenedSongID = "";
    let highestCount = 0;

    for (let songID in mostListenedSong) {
      if (mostListenedSong[songID] > highestCount) {
        highestCount = mostListenedSong[songID];
        mostListenedSongID = songID;
      }
    }

    return `${getSong(mostListenedSongID).artist}: ${
      getSong(mostListenedSongID).title
    }`;
  }
};

const getFridayNightEvents = (userID) => {
  const events = getListenEvents(userID) || [];
  return events.filter((event) => {
    const date = new Date(event.timestamp);
    const day = date.getDay();
    const hour = date.getHours();
    return (day === 5 && hour >= 17) || (day === 6 && hour < 4);
  });
};

export const songListenedMostOnFridayNight = (userID) => {
  const fridaySongs = getFridayNightEvents(userID);
  if (!fridaySongs.length) return null;

  const count = fridaySongs.reduce((acc, event) => {
    acc[event.song_id] = (acc[event.song_id] || 0) + 1;
    return acc;
  }, {});

  const mostSongID = Object.entries(count).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
  const song = getSong(mostSongID);
  return `${song.artist} – ${song.title}` || null;
};

const getMaxDuration = (songs, key) => {
  const totals = {};
  songs.forEach((song) => {
    const k = song[key];
    totals[k] = (totals[k] || 0) + song.duration_seconds;
  });

  return Object.entries(totals).reduce((a, b) => (b[1] > a[1] ? b : a));
};

export const mostTime = (userID) => {
  const songs = renderSongs(userID);
  if (!songs || songs.length === 0) return null;

  const songWithMaxDuration = songs.reduce((max, song) =>
    song.duration > max.duration ? song : max
  );

  return `${songWithMaxDuration.artist} - ${songWithMaxDuration.title}`;
};

export const mostArtist = (userID) => {
  const songs = renderSongs(userID);
  if (!songs) return null;
  const [artist, time] = getMaxDuration(songs, "artist");
  return artist;
};

export const mostTimeFriday = (userID) => {
  const songsUserListenedTo = getListenEvents(userID);
  if (!songsUserListenedTo.length) {
    return null;
  } else {
    const formattedEvents = songsUserListenedTo.map((event) => {
      const date = new Date(event.timestamp);
      return { ...event, dateObject: date };
    });

    let fridaySongs = formattedEvents.filter((event) => {
      const date = new Date(event.timestamp);
      const day = date.getDay();
      const hour = date.getHours();
      return (day === 5 && hour >= 17) || (day === 6 && hour < 4);
    });
    if (fridaySongs.length === 0) {
      return null;
    } else {
      let listenedSongs = [];
      fridaySongs.forEach((song) => {
        listenedSongs.push(getSong(song.song_id));
      });

      const songTotals = {};
      let highestCount = 0;
      let mostListenedSong = "";

      listenedSongs.forEach((song) => {
        const songTime = song.duration_seconds;
        const songTitle = song.title;

        if (songTotals[songTitle]) {
          songTotals[songTitle] += songTime;
        } else {
          songTotals[songTitle] = songTime;
        }
      });

      for (const [title, totalTime] of Object.entries(songTotals)) {
        if (totalTime > highestCount) {
          highestCount = totalTime;
          mostListenedSong = title;
        }
      }

      const songObj = listenedSongs.find((s) => s.title === mostListenedSong);
      if (!songObj) return null;
      return `${songObj.artist} – ${songObj.title} `;
    }
  }
};

export const longestStreakSong = (userID) => {
  const songs = renderSongs(userID);
  if (!songs) return null;

  let maxStreak = 1;
  let currentStreak = 1;
  let songTitle = songs[0].title;
  let currentSong = songTitle;

  for (let i = 1; i < songs.length; i++) {
    if (songs[i].title === currentSong) {
      currentStreak++;
    } else {
      currentSong = songs[i].title;
      currentStreak = 1;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      songTitle = currentSong;
    }
  }
  const songObj = songs.find((s) => s.title === songTitle);
  if (!songObj) return `${songTitle} (${maxStreak} times)`;
  return `${songObj.artist} – ${songObj.title} `;
};
