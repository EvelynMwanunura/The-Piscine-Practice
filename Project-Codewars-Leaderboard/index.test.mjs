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

global.fetch = fetch;
global.alert = () => {};

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
