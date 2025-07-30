import test from "node:test";
import assert from "node:assert/strict";

import * as music from "./common.mjs";

test("should return the artist listened to the most", () => {
  const mockSongs = [
    { song_id: "song-2", artist: "Frank Turner" },
    { song_id: "song-3", artist: "Frank Turner" },
    { song_id: "song-4", artist: "Frank Turner" },
    { song_id: "song-7", artist: "Faithless" },
  ];

  music.renderSongs = () => mockSongs;

  const result = music.renderMostListenedArtist("1");
  assert.equal(result, "Frank Turner");
});

test("should return null if renderSongs returns null", () => {
  music.renderSongs = () => null;
  const result = music.renderMostListenedArtist("1");
  assert.equal(result, null);
});

test("should return one of the top artists in case of a tie", () => {
  const mockSongs = [
    { song_id: "song-2", artist: "Frank Turner" },
    { song_id: "song-3", artist: "Frank Turner" },
    { song_id: "song-7", artist: "Faithless" },
    { song_id: "song-8", artist: "Faithless" },
  ];

  music.renderSongs = () => mockSongs;

  const result = music.renderMostListenedArtist("1");
  assert.ok(["Frank Turner", "Faithless"].includes(result));
});
