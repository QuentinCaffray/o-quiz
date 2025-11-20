import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import assert from "node:assert";
import { adminRequester } from "../../test/index.ts";

// Test GET ALL
describe("[GET] /tags", () => {
  it("should return all tags", async () => {
    // ARRANGE
    const tags = await prisma.tag.createManyAndReturn({
      data: [{ name: "Fantastique" }, { name: "Science physique" }],
    });
    // ACT
    const { data: body } = await adminRequester.get("/tags");

    // ASSERT
    assert.deepStrictEqual(body, [
      {
        id: tags[0].id,
        name: tags[0].name,
        created_at: tags[0].created_at.toISOString(),
        updated_at: tags[0].updated_at.toISOString(),
      },
      {
        id: tags[1].id,
        name: tags[1].name,
        created_at: tags[1].created_at.toISOString(),
        updated_at: tags[1].updated_at.toISOString(),
      },
    ]);
  });
});

// Test GET by ID
describe("[GET] /tags/:id", () => {
  it("should return the requested tag", async () => {
    // ARRANGE
    const createdTag = await prisma.tag.create({
      data: { name: "Culture Générale" },
    });

    // ACT
    const { status, data } = await adminRequester.get(`/tags/${createdTag.id}`);

    // ASSERT
    assert.equal(status, 200);
    assert.equal(data.id, createdTag.id);
    assert.equal(data.name, createdTag.name);
  });

  it("should return a 404 status when the requested tag does not exist", async () => {
    // ARRANGE
    const unexistingTagId = 9999999;

    // ACT
    const { status, data } = await adminRequester.get(
      `/tags/${unexistingTagId}`
    );

    // ASSERT
    assert.equal(status, 404);
    assert.equal(data.error, "Tag not found");
  });
});

// Test POST
describe("[POST] /tags", () => {
  it("should save a tag in database", async () => {
    // ARRANGE
    const body = { name: "Batman" };

    // ACT
    await adminRequester.post("/tags", body);

    // ASSERT
    const createdTag = await prisma.tag.findFirstOrThrow();
    assert.equal(createdTag.name, body.name);
  });

  it("should return a 201 status with a created tag", async () => {
    // ARRANGE
    const body = { name: "Superman" };

    // ACT
    const { data, status } = await adminRequester.post("/tags", body);

    // ASSERT
    assert.equal(status, 201);
    assert.ok(data.id);
    assert.ok(data.created_at);
    assert.ok(data.updated_at);
    assert.equal(data.name, body.name);
  });

  it("should return a 409 status when the name is already taken", async () => {
    // ARRANGE
    await prisma.tag.create({ data: { name: "Déjà pris" } });
    const body = { name: "Déjà pris" }; //

    // ACT
    const { status } = await adminRequester.post("/tags", body);

    // ASSERT
    assert.equal(status, 409);
  });
});

// Test UPDATE
describe("[PATCH] /tags/:id", () => {
  it("should update an existing tag in database", async () => {
    // ARRANGE
    // - Il nous faut déjà un niveau dans la BDD
    const tagToUpdate = await prisma.tag.create({
      data: { name: "Jardiland" },
    });
    // - Il nous faut un body pour faire l'appel API
    const body = { name: "Disneyland" };

    // ACT
    // - Appel API
    await adminRequester.patch(`/tags/${tagToUpdate.id}`, body);

    // ASSERT
    // - Regarder dans la BDD si le niveau a été mis à jour
    const updatedTag = await prisma.tag.findUniqueOrThrow({
      where: { id: tagToUpdate.id },
    });
    assert.equal(updatedTag.id, tagToUpdate.id);
    assert.equal(updatedTag.name, body.name);
    assert.notEqual(updatedTag.updated_at, updatedTag.created_at); // La date d'update a été mise à jour également
  });

  it("should return the updated tag", async () => {
    // ARRANGE
    const tagToUpdate = await prisma.tag.create({
      data: { name: "A mettre à jour" },
    });
    const body = { name: "Nouveau nom du tag" };

    // ACT
    const { status, data } = await adminRequester.patch(
      `/tags/${tagToUpdate.id}`,
      body
    );

    // ASSERT
    assert.equal(status, 200);
    assert.ok(data.id);
    assert.ok(data.created_at);
    assert.ok(data.updated_at);
    assert.equal(data.name, body.name);
  });

  it("should return a 404 when the requested tag does not exist", async () => {
    // ARRANGE
    const unexistingtagId = 42;
    const body = { name: "Nouveau nom" };

    // ACT
    const { status } = await adminRequester.patch(
      `/tags/${unexistingtagId}`,
      body
    );

    // ASSERT
    assert.equal(status, 404);
  });

  it("should return a 409 if the target name is already taken", async () => {
    // ARRANGE
    const tagToUpdate = await prisma.tag.create({
      data: { name: "A mettre à jour" },
    });
    await prisma.tag.create({ data: { name: "Déjà pris" } });
    const body = { name: "Déjà pris" };

    // ACT
    const { status } = await adminRequester.patch(
      `/tags/${tagToUpdate.id}`,
      body
    );

    // ASSERT
    assert.equal(status, 409);
  });
});

describe("[DELETE] /tags/:id", () => {
  it("should delete an existing tag in database", async () => {
    // ARRANGE
    const tagToDelete = await prisma.tag.create({
      data: { name: "A supprimer" },
    });

    // ACT
    const { status } = await adminRequester.delete(`/tags/${tagToDelete.id}`);

    // ASSERT
    assert.equal(status, 204);
    const deletedTag = await prisma.tag.findUnique({
      where: { id: tagToDelete.id },
    });
    assert.equal(deletedTag, null);
  });

  it("should return 404 when try to delete unexisting tag", async () => {
    // ARRANGE

    // ACT
    const { status, data } = await adminRequester.delete(`/tags/999999`);

    // ASSERT
    assert.equal(status, 404);
    assert.equal(data.error, "Tag not found");
  });
});
