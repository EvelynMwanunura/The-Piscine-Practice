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

// What does this function do? The word "render" in its name suggests it's showing something on screen? I don't think it is?
// (Same question for several of the functions in this file.)

//the function retrieves and returns  the songs for selected  user, I have changed the name.
export const fetchSongsForUser = (userID) => {
  const fullSongs = getFullSongData(userID);
  return fullSongs.length ? fullSongs : null;
};

/////////////////////////////////////////////////////////
const groupSongsByDateOfListen = (userID) => {
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
  const songsByDate = groupSongsByDateOfListen(userID);

  const dailySong = Object.values(songsByDate).map(
    (songs) => new Set(songs.map((song) => song.song_id))
  );

  if (dailySong.length === 0) return null;

  // In general I'd expect a variable named commonSong to contain a single value (a "scalar"), or a variable which contained an array to be named plural, like commonSongs.
  // This is a useful convention to help people reading the code to understand whether you have a scalar or a multi-item value.
  const commonSongs = [
    ...dailySong.reduce((common, daySong) => {
      // If you have two Sets, this operation is called the "intersection" - finding the Set which has the overlap of the two sets.
      // Can you work out how to implement this check more simply, using just Sets and no extra arrays?

      if (!common) {
        return daySong;
      }

      const intersection = new Set();
      for (const songID of common) {
        if (daySong.has(songID)) {
          intersection.add(songID);
        }
      }
      return intersection;
    }),
  ];

  if (commonSongs.length === 0) return null;

  const songsWithArtist = commonSongs.map((songID) => {
    const song = getSong(songID);
    return `${song.artist} - ${song.title}`;
  });

  return songsWithArtist;
};

const getMostListenedGenres = (userID) => {
  const songs = fetchSongsForUser(userID);
  if (!songs) return [];

  const genreCount = songs.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
};

// We often (though it isn't required) split up the "find the things" logic in one function, and the "display the things" in another.
// That would mean here we'd return an array of top genres, and when we are displaying things on the page we'd do the joining into a string, and the counting.

export const renderMostListenedGenre = (userID) => {
  const topGenres = getMostListenedGenres(userID);
  if (topGenres.length === 0) return null;
  return topGenres;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getFridayNightEvents = (userID) => {
  const events = getListenEvents(userID) || [];
  return events.filter((event) => {
    const date = new Date(event.timestamp);
    const day = date.getDay();
    const hour = date.getHours();
    return (day === 5 && hour >= 17) || (day === 6 && hour < 4);
  });
};

// You have several nearly identical functions here - renderMostListenedArtist, renderMostListenedSong, songListenedMostOnFridayNight are all doing basically the same thing.
// Can you think how to make them less repetitive?

export const renderMostListenedSong = (userID, getEvents = getListenEvents) => {
  const events = getEvents(userID);
  if (!events.length) return null;
  const count = events.reduce((acc, event) => {
    acc[event.song_id] = (acc[event.song_id] || 0) + 1;
    return acc;
  }, {});
  const mostSongID = Object.entries(count).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
  const song = getSong(mostSongID);
  return song ? `${song.artist} – ${song.title}` : null;
};

export const songListenedMostOnFridayNight = (userID) => {
  return renderMostListenedSong(userID, getFridayNightEvents);
};

export const renderMostListenedArtist = (userID) => {
  const songs = fetchSongsForUser(userID);
  if (!songs) return null;

  const artistCount = songs.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + 1;
    return acc;
  }, {});

  const mostListenedArtist = Object.keys(artistCount).reduce((a, b) =>
    artistCount[a] > artistCount[b] ? a : b
  );

  return mostListenedArtist || null;
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
  const songs = fetchSongsForUser(userID);
  if (!songs || songs.length === 0) return null;

  const [songId, time] = getMaxDuration(songs, "id");
  const song = getSong(songId);
  return song ? `${song.artist} - ${song.title}` : null;
};

export const mostArtist = (userID) => {
  const songs = fetchSongsForUser(userID);
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
  const songs = fetchSongsForUser(userID);
  if (!songs || songs.length === 0) return null;

  let maxStreak = 0;
  let currentStreak = 0;
  let currentSongTitle = null;
  let longestStreakSongs = [];

  for (let i = 1; i < songs.length; i++) {
    const song = songs[i];
    if (song.title === currentSongTitle) {
      currentStreak++;
    } else {
      currentSongTitle = song.title;
      currentStreak = 1;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      longestStreakSongs = [currentSongTitle];
    } else if (currentStreak === maxStreak) {
      if (!longestStreakSongs.includes(currentSongTitle)) {
        longestStreakSongs.push(currentSongTitle);
      }
    }
  }
  if (longestStreakSongs.length === 0 && songs.length > 0) {
    longestStreakSongs.push(songs[0].title);
    maxStreak = 1;
  }

  const result = longestStreakSongs.map((title) => {
    const songObj = songs.find((s) => s.title === title);
    return songObj ? `${songObj.artist} - ${songObj.title}` : title;
  });

  if (result.length === 1) {
    return result[0];
  } else if (result.length > 1) {
    return result.join(", ");
  } else {
    return null;
  }
};
