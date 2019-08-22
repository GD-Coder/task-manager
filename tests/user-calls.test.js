const request = require("supertest")
const app = require("../src/app.js")
const User = require("../src/db/models/user")
const { userId, userOne, configureDB } = require("./fixtures/db")

beforeEach(configureDB)

test("Should sign up a user", async () => {
  const response = await request(app)
    .post("/user")
    .send({ name: "Test User", email: "test@user.com", password: "test1234" })
    .expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: "Test User",
      email: "test@user.com"
    },
    token: user.tokens[0].token
  })
  expect(user.pasword).not.toBe("test1234")
})

test("Should log in existing user", async () => {
  const response = await request(app)
    .post("/user/login")
    .send({ email: userOne.email, password: userOne.password })
    .expect(200)

  const user = await User.findById(userId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not log in with invalid credentials", async () => {
  await request(app)
    .post("/user/login")
    .send({ email: userOne.email, password: "badcredstest" })
    .expect(400)
})

test("Should get user profile", async () => {
  const response = await request(app)
    .get("/user/me")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: "Jimmy Tester",
      email: "jimmy@tester.com"
    }
  })
})

test("Should log out", async () => {
  await request(app)
    .post("/user/logout")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("Should not delete account for unauthorized user", async () => {
  await request(app)
    .delete("/user/remove")
    .send()
    .expect(401)
})

test("Should delete account for authorized user", async () => {
  await request(app)
    .delete("/user/remove")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userId)
  expect(user).toBeNull()
})

test("Should upload avatar image", async () => {
  await request(app)
    .post("/user/me/avatar")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/happy.png")
    .expect(201)

  const user = await User.findById(userId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
  const response = await request(app)
    .patch("/user/update")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .send({ name: "Amanda Tester" })
    .expect(200)

  const user = await User.findById(userId)
  expect(user.name).toEqual("Amanda Tester")
})

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/user/update")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .send({ _id: 1234 })
    .expect(400)
})
