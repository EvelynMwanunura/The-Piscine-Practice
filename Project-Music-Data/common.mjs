import { getSong, getListenEvents } from "./data.mjs";

export const renderSongs = (userID) => {
  const songsUserListenedTo = getListenEvents(userID) || [];
  if (!songsUserListenedTo.length) {
    return null;
  } else {
    let listenedSongs = [];
    songsUserListenedTo.forEach((song) => {
      listenedSongs.push(getSong(song.song_id));
    });
    return listenedSongs;
  }
};

export const renderMostListenedArtist = (userID) => {
  let listenedArtists = {};

  const songsListenedTo = renderSongs(userID);
  if (songsListenedTo === null) {
    return null;
  } else {
    songsListenedTo.map((song) => {
      listenedArtists[song.artist] = (listenedArtists[song.artist] || 0) + 1;
    });

    let mostMostListenedArtist = "";
    let highestCount = 0;

    for (let artist in listenedArtists) {
      if (listenedArtists[artist] > highestCount) {
        highestCount = listenedArtists[artist];
        mostMostListenedArtist = artist;
      }
    }

    return mostMostListenedArtist;
  }
};

export const renderMostListenedGenre = (userID) => {
  let listenedGenres = {};

  const songsListenedTo = renderSongs(userID) || [];
  if (!songsListenedTo || songsListenedTo.length === 0) {
    return null;
  } else {
    songsListenedTo.map((song) => {
      listenedGenres[song.genre] = (listenedGenres[song.genre] || 0) + 1;
    });

    let mostListenedGenres = [];

    for (let genre in listenedGenres) {
      mostListenedGenres.push({ genre, count: listenedGenres[genre] });
    }
    mostListenedGenres.sort((a, b) => b.count - a.count).slice(0, 3);

    if (mostListenedGenres.length > 0) {
      return mostListenedGenres
        .map((item) => item.genre)
        .slice(0, 3)
        .join(", ");
    } else return null;
  }
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

    return getSong(mostListenedSongID).title;
  }
};

export const songListenedMostOnFridayNight = (userID) => {
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
    }

    let mostSongListenedOnFriday = {};
    for (let song of fridaySongs) {
      mostSongListenedOnFriday[song.song_id] =
        (mostSongListenedOnFriday[song.song_id] || 0) + 1;
    }
    let mostSongListenedOnFridayID = "";
    let highestCount = 0;

    for (let songID in mostSongListenedOnFriday) {
      if (mostSongListenedOnFriday[songID] > highestCount) {
        highestCount = mostSongListenedOnFriday[songID];
        mostSongListenedOnFridayID = songID;
      }
    }
    return getSong(mostSongListenedOnFridayID).title || null;
  }
};

export const mostTime = (userID) => {
  const listenedSongs = renderSongs(userID);
  if (!listenedSongs || listenedSongs.length === 0) {
    return null;
  } else {
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

    return `${mostListenedSong} with ${highestCount} seconds`;
  }
};

export const mostArtist = (userID) => {
  const listenedSongs = renderSongs(userID);
  if (!listenedSongs || listenedSongs.length === 0) {
    return null;
  } else {
    const songTotals = {};
    let highestCount = 0;
    let mostListenedSong = "";

    listenedSongs.forEach((song) => {
      const songTime = song.duration_seconds;
      const songArtist = song.artist;

      if (songTotals[songArtist]) {
        songTotals[songArtist] += songTime;
      } else {
        songTotals[songArtist] = songTime;
      }
    });

    for (const [artist, totalTime] of Object.entries(songTotals)) {
      if (totalTime > highestCount) {
        highestCount = totalTime;
        mostListenedSong = artist;
      }
    }

    return `${mostListenedSong} with ${highestCount} seconds`;
  }
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

      return `Friday ${mostListenedSong} with ${highestCount} seconds` || null;
    }
  }
};

export const longestStreakSong = (userID) => {
  const listenedSongs = renderSongs(userID);
  if (!listenedSongs || listenedSongs.length === 0) {
    return null;
  } else {
    let longestStreak = [];
    listenedSongs.map((song) => {
      const songTitle = song.title;
      longestStreak.push(songTitle);
    });

    let longestStreakCount = 0;
    let currentStreakCount = 0;

    for (let i = 0; i < longestStreak.length; i++) {
      if (longestStreak[i] === longestStreak[i + 1]) {
        currentStreakCount++;
      } else {
        if (currentStreakCount > longestStreakCount) {
          longestStreakCount = currentStreakCount;
        }
        currentStreakCount = 0;
      }
    }
    return `${longestStreak[longestStreakCount]} with a streak of ${longestStreakCount} times`;
  }
};
