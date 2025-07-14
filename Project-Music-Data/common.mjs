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
