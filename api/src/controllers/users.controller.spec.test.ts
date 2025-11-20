import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import assert from "node:assert";
import { adminRequester } from "../../test/index.ts";

describe("[GET] /api/users", () => {
  it("should return the users from the database", async () => {
    // ARRANGE
    // --> rajouter des faux utilisateurs dans la BDD
    await prisma.user.createMany({
      data: [
        {
          firstname: "Alice",
          lastname: "Oclock",
          email: "alice@oclock.io",
          password: "1234",
        },
        {
          firstname: "Bob",
          lastname: "Oclock",
          email: "bob@oclock.io",
          password: "1234",
        },
      ],
    });

    // ACT
    // --> faire l'appel fetch pour les récupérer
    const { data: body } = await adminRequester.get("/users");

    // ASSERT
    // --> s'assurer que ce sont bien les utilisateurs qu'on a inséré
    assert.equal(body.length, 2);
    assert.equal(body[0].email, "alice@oclock.io");
    assert.equal(body[1].email, "bob@oclock.io");
  });

  it("should return an empty array when the database is empty", async () => {
    // ACT
    const { data: body } = await adminRequester.get("/users");

    // ASSERT
    assert.equal(body.length, 0);
  });

  it("should return all properties of users", async () => {
    // ARRANGE
    await prisma.user.createMany({
      data: [
        {
          firstname: "Alice",
          lastname: "Oclock",
          email: "alice@oclock.io",
          password: "1234",
        },
      ],
    });

    // ACT
    const {
      data: [alice],
    } = await adminRequester.get("/users");

    // ASSERT
    assert.equal(alice.firstname, "Alice");
    assert.equal(alice.lastname, "Oclock");
    assert.equal(alice.email, "alice@oclock.io");
    assert.ok(alice.id);
    assert.ok(alice.created_at);
    assert.ok(alice.updated_at);
  });

  it("should not return the users' password", async () => {
    // ARRANGE
    await prisma.user.createMany({
      data: [
        {
          firstname: "Alice",
          lastname: "Oclock",
          email: "alice@oclock.io",
          password: "1234",
        },
      ],
    });

    // ACT
    const {
      data: [alice],
    } = await adminRequester.get("/users");

    // ASSERT
    assert.equal(alice.password, undefined); // On s'assure, advitam eternam, que l'API ne renverra plus les mdp des utilisateurs
  });
});

describe("[GET] /api/users/:id", () => {
  it("should return the requested user", async () => {
    // ARRANGE
    // -> créer un utilisateur en BDD
    const databaseUser = await prisma.user.create({
      data: {
        firstname: "John",
        lastname: "Doe",
        email: "john@oclock.io",
        password: "1234",
      },
    });

    // ACT
    // -> appeler l'utilisateur
    const { data: apiUser } = await adminRequester.get(
      `/users/${databaseUser.id}`
    );

    // ASSERT
    // -> vérifier les champs, notamment que l'ID correspond bien
    assert.equal(apiUser.id, databaseUser.id);
    assert.equal(apiUser.firstname, databaseUser.firstname);
    assert.equal(apiUser.lastname, databaseUser.lastname);
    assert.equal(apiUser.email, databaseUser.email);
    assert.equal(apiUser.created_at, databaseUser.created_at.toISOString());
    assert.equal(apiUser.updated_at, databaseUser.updated_at.toISOString());
    assert.equal(apiUser.password, undefined);
  });

  it("should return a 404 status when the requested user does not exist", async () => {
    // ARRANGE
    const userId = 42; // User qui n'existe pas !

    // ACT
    const { data: body, status } = await adminRequester.get(`/users/${userId}`);

    // ASSERT
    assert.equal(status, 404);
    assert.equal(body.error, "User not found");
  });
});
