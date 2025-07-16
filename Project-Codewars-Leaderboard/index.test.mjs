// This is a placeholder file which shows how you use the nock library to
// "mock" fetch requests, replacing real requests with fake ones that you
// control in the test. This means you can "force" the fetch request to return
// data in the format that you want.
// IMPORTANT: You _must_ run npm install within the Project-Codewars-Leaderboard
// folder for this to work.
// You can change or delete the contents of the file once you have understood
// how it works.

import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { getUsers } from "./fetchAPI.mjs";
import { getValidUsers } from "./getValidUsers.mjs";
import { sortUsers } from "./sortUsers.mjs";

global.fetch = fetch;

test("mocks a get user function using nock", async () => {
  const mockUserData = {
    username: "someone",
    clan: "someclan",
    ranks: {
      overall: {
        score: 100,
      },
      languages: {
        javascript: { score: 100 },
      },
    },
  };
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/someone")
    .reply(200, mockUserData);

  const result = await getUsers("someone");

  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    user: "someone",
    data: mockUserData,
  });

  assert.ok(scope.isDone(), "Expected fetch call was not made");
});

test("Get valid users and filter out invalid users", async () => {
  global.alert = () => {};

  const validScope = nock("https://www.codewars.com")
    .get("/api/v1/users/someone")
    .reply(200, {
      username: "someone",
      clan: "cyf",
      ranks: { overall: { score: 100 } },
    });

  const invalidScope = nock("https://www.codewars.com")
    .get("/api/v1/users/notfound")
    .reply(404, {});

  const result = await getValidUsers("someone, notfound");

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].username, "someone");

  assert.ok(validScope.isDone(), "Valid user request was  not made");
  assert.ok(invalidScope.isDone(), "Invalid user request was not made");
});

const users = [
  {
    username: "user1",
    clan: "clan1",
    ranks: {
      overall: { score: 200 },
      languages: { javascript: { score: 150 } },
    },
  },
  {
    username: "user2",
    clan: "clan2",
    ranks: {
      overall: { score: 300 },
      languages: { javascript: { score: 250 } },
    },
  },
];
test("sortUsers sorts users by overall score", () => {
  const sortedUsers = sortUsers(users, "");
  assert.strictEqual(sortedUsers[0].username, "user2");
  assert.strictEqual(sortedUsers[1].username, "user1");
});
test("sortUsers sorts users by language score", () => {
  const sortedUsers = sortUsers(users, "javascript");
  assert.strictEqual(sortedUsers[0].username, "user2");
  assert.strictEqual(sortedUsers[1].username, "user1");
});
