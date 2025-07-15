import { getUserIDs } from "./data.mjs";
import { getSong, getListenEvents } from "./data.mjs";

export const renderSongs = (userID) => {
  const songsUserListenedTo = getListenEvents(userID) || [];
  let listenedSongs = [];
  songsUserListenedTo.forEach((song) => {
    listenedSongs.push(getSong(song.song_id));
  });
  return listenedSongs;
};

export const renderMostListenedArtist = (userID) => {
  let listenedArtists = {};

  const songsListenedTo = renderSongs(userID);
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

  if (!mostMostListenedArtist) {
    return "user has not listened to anything ";
  } else return mostMostListenedArtist;
};

export const renderMostListenedGenre = (userID) => {
  let listenedGenres = {};

  const songsListenedTo = renderSongs(userID);
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
  } else return "user has not listened to any Genre";
};

export const renderMostListenedSong = (userID) => {
  const listenedSongs = renderSongs(userID);

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
};

export const songListenedMostOnFridayNight = (userID) => {
  const songsUserListenedTo = getListenEvents(userID);
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
  return getSong(mostSongListenedOnFridayID).title;
};

export const mostTime = (userID) => {
  const listenedSongs = renderSongs(userID);

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
    console.log(`${title}: ${totalTime} seconds`);

    if (totalTime > highestCount) {
      highestCount = totalTime;
      mostListenedSong = title;
    }
  }

  return `${mostListenedSong} with ${highestCount} seconds`;
};

console.log(mostTime(2));

export const mostArtist = (userID) => {
  const listenedSongs = renderSongs(userID);

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
    console.log(`${artist}: ${totalTime} seconds`);

    if (totalTime > highestCount) {
      highestCount = totalTime;
      mostListenedSong = artist;
    }
  }

  return `${mostListenedSong} with ${highestCount} seconds`;
};
mostArtist(2);

export const mostTimeFriday = (userID) => {
  const songsUserListenedTo = getListenEvents(userID);
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
  console.log("friday songs ", fridaySongs);

  let listenedSongs = [];
  fridaySongs.forEach((song) => {
    listenedSongs.push(getSong(song.song_id));
  });
  console.log("listened songs ", listenedSongs);
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
    console.log(`${title}: ${totalTime} seconds`);

    if (totalTime > highestCount) {
      highestCount = totalTime;
      mostListenedSong = title;
    }
  }

  return `Friday ${mostListenedSong} with ${highestCount} seconds`;
};

console.log(mostTimeFriday(1));
