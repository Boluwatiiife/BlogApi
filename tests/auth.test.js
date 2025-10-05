const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (app && app.close) {
    await app.close();
  }
});

describe("Auth", () => {
  it("should signup a user", async () => {
    const res = await request(app).post("/auth/signup").send({
      first_name: "Oliwafisayomi",
      last_name: "Tunde-lawal",
      email: "fisayo@gmail.com",
      password: "qwerty1234",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
  it("should login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "fisayo@gmail.com",
      password: "qwerty1234",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
