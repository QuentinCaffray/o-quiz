import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import assert from "node:assert";
import { adminRequester } from "../../test/index.ts";

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
