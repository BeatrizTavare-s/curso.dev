import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("POST to /api/v1/migrations should return 200", async () => {
  const responseFirstRequest = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(responseFirstRequest.status).toBe(201);

  const responseFirstRequestBody = await responseFirstRequest.json();

  const responseFirstRequestBodyExpect = [
    {
      path: "infra/migrations/1714768991936_first-migration-test.js",
      name: "1714768991936_first-migration-test",
      timestamp: 1714768991936,
    },
  ];

  expect(Array.isArray(responseFirstRequestBody)).toBe(true);
  expect(responseFirstRequestBody).toEqual(
    expect.arrayContaining(responseFirstRequestBodyExpect),
  );
  expect(responseFirstRequestBody.length).toBeGreaterThan(0);

  const responseSecondRequest = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );

  const responseSecondRequestBody = await responseSecondRequest.json();
  expect(responseSecondRequest.status).toBe(200);
  expect(responseSecondRequestBody.length).toBe(0);
});
