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
console.log("most listened genres:", renderMostListenedGenre(4));
