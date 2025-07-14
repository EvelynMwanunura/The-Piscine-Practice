import { getUserIDs } from "./data.mjs";
import { getSong, getListenEvents } from "./data.mjs";

export const renderSongs = (userID) => {
  const songsUserListenedTo = getListenEvents(userID);
  let listenedSongs = [];
  songsUserListenedTo.forEach((song) => {
    listenedSongs.push(getSong(song.song_id));
  });
  return listenedSongs;
};

console.log("songs rendered", renderSongs(4));

const renderMostListenedArtist = (userID) => {
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

console.log("most listened artist:", renderMostListenedArtist(4));

const renderMostListenedGenre = (userID) => {
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
    return mostListenedGenres.map((item) => item.genre).slice(0, 3);
  } else return "user has not listened to any Genre";
};
console.log("most listened genres:", renderMostListenedGenre(3));

const renderMostListenedSong = (userID) => {
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

console.log("most listened song ", renderMostListenedSong(3));

const songListenedMostOnFridayNight = (userID) => {
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
console.log("most listened song on Friday:", songListenedMostOnFridayNight(2));
