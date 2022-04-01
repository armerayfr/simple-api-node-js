const request = require("supertest");
const app = require("../src/app");

test("should login user static", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: "armerray",
      password: "nodejs123$!",
    })
    .expect(200);
});

test("should invalid username/password", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: "a1234521",
      password: "4542asd",
    })
    .expect(404);
});

test("should return payload jobs", async () => {
  const response = await request(app).get("/jobs").expect(200);
});

test("should return payload job", async () => {
  const response = await request(app)
    .get("/job/f4a7c47f-c8ac-49fa-b15b-4ab37bfd2307")
    .expect(200);
});

test("should return not found by not existing id", async () => {
  const response = await request(app).get("/job/RANDOMID").expect(404);
});
