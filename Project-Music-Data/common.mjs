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

console.log("songs rendered", renderSongs(3));

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
  return mostMostListenedArtist;
};

console.log("most listened artist:", renderMostListenedArtist(1));
