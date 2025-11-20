import { describe, it } from "node:test";
import { adminRequester, generateFakeUser, httpRequester } from "../../test/index.ts";
import { prisma } from "../models/index.ts";
import assert from "node:assert";
import argon2 from "argon2";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config.ts";
import { generateRefreshToken } from "./auth.controller.ts";
import { generateAccessToken } from "../lib/auth.ts";

describe("[POST] /auth/register", () => {
  it("should register the user in database (with its hashed password)", async () => {
    // ARRANGE
    const body = {
      firstname: "Johnny",
      lastname: "Oclock",
      email: "johnny@oclock.io",
      password: "P4$$Word!"
    };

    // ACT
    await httpRequester.post("/auth/register", body);

    // ASSERT
    const user = await prisma.user.findFirstOrThrow(); // On devrait retrouver l'utilisateur comme ça puisque c'est le seul
    assert.ok(user.id);
    assert.ok(user.created_at);
    assert.ok(user.updated_at);
    assert.equal(user.firstname, body.firstname);
    assert.equal(user.lastname, body.lastname);
    assert.equal(user.email, body.email);
    assert.match(user.password, /argon2/); // Les slashes délimitent une RegEx
  });

  it("should return the user (without its password)", async () => {
    // ARRANGE
    const body = {
      firstname: "Johnny",
      lastname: "Oclock",
      email: "johnny@oclock.io",
      password: "P4$$Word!"
    };

    // ACT
    const { status, data } = await httpRequester.post("/auth/register", body);

    // ASSERT
    assert.equal(status, 201);
    assert.ok(data.id);
    assert.ok(data.created_at);
    assert.ok(data.updated_at);
    assert.equal(data.firstname, body.firstname);
    assert.equal(data.lastname, body.lastname);
    assert.equal(data.password, undefined);
  });
  
  it("should return a 409 if the email is already taken", async () => {
    // ARRANGE
    const body = {
      firstname: "Johnny",
      lastname: "Oclock",
      email: "johnny@oclock.io",
      password: "P4$$Word!"
    };
    await prisma.user.create({ data: body }); // On pré-inscrit l'utilisateur pour l'empêcher de se ré-inscrire

    // ACT
    const { status } = await httpRequester.post("/auth/register", body);

    // ASSERT
    assert.equal(status, 409);
  });

  it("should return a 422 when the provided password is too short", async () => {
    // ARRANGE
    const body = {
      firstname: "Johnny",
      lastname: "Oclock",
      email: "johnny@oclock.io",
      password: "T0to!" // 5 caractères
    };

    // ACT
    const { status } = await httpRequester.post("/auth/register", body);

    // ASSERT
    assert.equal(status, 422);
  });
});

describe("[POST] /auth/login", () => {
  it("should return a JWT containing the userId", async () => {
    // ARRANGE
    // - 1 utilisateur avec un mdp haché en BDD
    const user = await prisma.user.create({ data: {
      firstname: "John",
      lastname: "Doe",
      email: "john@doe.io",
      password: await argon2.hash("Helloworld")
    } });
    // - 1 body pour faire l'appel
    const body = { email: "john@doe.io", password: "Helloworld" };

    // ACT
    // - POST /auth/login
    const { data } = await httpRequester.post("/auth/login", body);

    // ASSERT
    // - regarder le JWT renvoyé, le décoder pour vérifier ce que contient le payload
    assert.ok(data.accessToken);
    assert.match(data.accessToken, /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/);
    const payload = jwt.decode(data.accessToken) as JwtPayload; // On cast le type vers un JwtPayload (une forme d'objet)
    assert.equal(payload.userId, user.id);
    assert.ok(payload.iat);
    assert.ok(payload.exp);
  });

  it("should return a refresh token", async () => {
    // ARRANGE
    const user = await prisma.user.create({ data: {
      firstname: "John",
      lastname: "Doe",
      email: "john@doe.io",
      password: await argon2.hash("Helloworld")
    } });
    const body = { email: "john@doe.io", password: "Helloworld" };

    // ACT
    const { data } = await httpRequester.post("/auth/login", body);

    // ASSERT
    assert.ok(data.refreshToken);
    // Vérifier aussi que le token est bien dans la BDD avec le userId dessus !
    const refreshToken = await prisma.refreshToken.findFirstOrThrow();
    assert.equal(refreshToken.token, data.refreshToken);
    assert.equal(refreshToken.user_id, user.id);
  });

  it("should return 401 when the user does not exist", async () => {
    // ARRANGE
    const body = { email: "unexisting@user.io", password: "toto01" };

    // ACT
    const { status, data } = await httpRequester.post("/auth/login", body);

    // ARRANGE
    assert.equal(status, 401);
    assert.equal(data.error, "Wrong credentials email/password");
  });

  it("should return 401 when the password does not match", async () => {
    // ARRANGE
    await prisma.user.create({ data: {
      firstname: "John",
      lastname: "Doe",
      email: "john@doe.io",
      password: await argon2.hash("Helloworld")
    } });
    const body = { email: "john@doe.io", password: "Mauvais mot de passe" };

    // ACT
    const { status, data } = await httpRequester.post("/auth/login", body);

    // ARRANGE
    assert.equal(status, 401);
    assert.equal(data.error, "Wrong credentials email/password");
  });
});

describe("[GET] /auth/me", () => {
  it("should return the user info when a valid JWT is provided", async () => {
    // ARRANGE
    // - Un user
    const user = await prisma.user.create({ data: generateFakeUser() });
    // - Un jeton JWT correspondant à ce user (soit en appellant la route /login || soit en appelant la fonction jwt.sign)
    const accessToken = generateAccessToken(user);

    // ACT
    // - On oublie pas le header d'authorization
    const { data, status } = await httpRequester.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // ASSERT
    // - On regarde si le user renvoyé correspond à celui qu'on avait créé
    assert.equal(status, 200);
    assert.equal(data.id, user.id);
    assert.equal(data.firstname, user.firstname);
    assert.equal(data.lastname, user.lastname);
    assert.equal(data.email, user.email);
    assert.equal(data.created_at, user.created_at.toISOString());
    assert.equal(data.updated_at, user.updated_at.toISOString());
    assert.equal(data.password, undefined);
  });

  it("should return the info when the JWT is provided in cookies", async () => {
    // ARRANGE
    const user = await prisma.user.create({ data: generateFakeUser() });
    const accessToken = generateAccessToken(user);

    // ACT
    const { status } = await httpRequester.get("/auth/me", {
      headers: { Cookie: `accessToken=${accessToken}` }
    });

    // ASSERT
    assert.equal(status, 200);
  });

  it("should return a 401 when the accessToken is not provided", async () => {
    // ACT
    const { status } = await httpRequester.get("/auth/me");

    // ASSERT
    assert.equal(status, 401);
  });

  it("should return a 401 when the accessToken is expired", async () => {
    // ARRANGE
    const user = await prisma.user.create({ data: generateFakeUser() });
    const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "1ms" });
    await new Promise(resolve => setTimeout(resolve, 10)); // Attend 10ms ==> notre JWT est expiré

    // ACT
    const { status } = await httpRequester.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // ASSERT
    assert.equal(status, 401);
  });

  it("should return a 401 when the accessToken is forged", async () => {
    // ARRANGE
    const user = await prisma.user.create({ data: generateFakeUser() });
    const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret);
    const fakeAccessToken = accessToken.replaceAll("e", "f"); // Ne faites pas ça chez vous

    // ACT
    const { status } = await httpRequester.get("/auth/me", {
      headers: { Authorization: `Bearer ${fakeAccessToken}` }
    });

    // ASSERT
    assert.equal(status, 401);
  });
});

describe("[POST] /auth/refresh", () => {
  it("should generate new tokens", async () => {
    // ARRANGE
    // - Un user en BDD
    const user = await prisma.user.create({ data: generateFakeUser() });
    // - Un refresh token valide
    const refreshToken = await generateRefreshToken(user);

    // ACT
    // - Faire l'appel avec le token dans le body
    const { data } = await httpRequester.post("/auth/refresh", { refreshToken });
    
    // ASSERT
    // - regarder la réponse : accessToken + refreshToken
    assert.ok(data.accessToken);
    assert.ok(data.refreshToken);
  });
});

describe("[POST] /auth/logout", () => {
  it("should unset the cookies", async () => {
    // ARRANGE

    // ACT
    const { status, headers } = await adminRequester.post("/auth/logout");

    // ASSERT
    assert.equal(status, 204);
    assert.equal(headers["set-cookie"]![0], 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    assert.equal(headers["set-cookie"]![1], 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });
});
