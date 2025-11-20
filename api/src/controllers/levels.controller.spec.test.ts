import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import assert from "node:assert";
import { adminRequester, authorRequester } from "../../test/index.ts";

describe("[GET] /levels", () => {
  it("should return all levels", async () => {
    // ARRANGE
    // --> créer 2 niveaux
    const levels = await prisma.level.createManyAndReturn({ data: [
      { name: "Niveau 1"},
      { name: "Niveau 2"}
    ] });
      
    // ACT
    // --> faire l'appel de la route
    const { data: body } = await adminRequester.get("/levels"); // CALL HTTP
      
    // ASSERT
    // --> Vérifier que la réponse contient 2 niveaux
    assert.deepStrictEqual(body, [
      {
        id: levels[0].id,
        name: levels[0].name,
        created_at: levels[0].created_at.toISOString(),
        updated_at: levels[0].updated_at.toISOString(),
      },
      {
        id: levels[1].id,
        name: levels[1].name,
        created_at: levels[1].created_at.toISOString(),
        updated_at: levels[1].updated_at.toISOString(),
      }
    ]);
  });
});

describe("[POST] /levels", () => {
  it("should save a level in database", async () => {
    // ARRANGE
    const body = { name: "Niveau à créer" };

    // ACT
    await adminRequester.post("/levels", body); // Appel API avec Axios

    // ASSERT
    const createdLevel = await prisma.level.findFirstOrThrow();
    assert.equal(createdLevel.name, body.name);
  });

  it("should return a 201 status with a created level", async () => {
    // ARRANGE
    const body = { name: "Niveau à créer" };

    // ACT
    const { data, status } = await adminRequester.post("/levels", body);

    // ASSERT
    assert.equal(status, 201);
    assert.ok(data.id); // Le level créé a bien un ID
    assert.ok(data.created_at);
    assert.ok(data.updated_at);
    assert.equal(data.name, body.name);
  });

  it("should return a 422 status when the name is not provided", async () => {
    // ARRANGE
    const body = { name: "" }; // Pas de nom !

    // ACT
    const { status } = await adminRequester.post("/levels", body);

    // ASSERT
    assert.equal(status, 422);
  });

  it("should return a 409 status when the name is already taken", async () => {
    // ARRANGE
    await prisma.level.create({ data: { name: "Déjà pris" } }); // - créer un level en BDD avec un nom fixé
    const body = { name: "Déjà pris" }; // - créer un body avec le même nom

    // ACT
    const { status } = await adminRequester.post("/levels", body);
    
    // ASSERT
    assert.equal(status, 409);
  });

  it("should return a 403 status when the requester is only a 'author' but not an 'admin'", async () => {
    // ARRANGE
    const body = { name: "Niveau à créer" };

    // ACT
    const { status } = await authorRequester.post("/levels", body);

    // ASSERT
    assert.equal(status, 403);
  });
});

describe("[PATCH] /levels/:id", () => {
  it("should update an existing level in database", async () => {
    // ARRANGE
    // - Il nous faut déjà un niveau dans la BDD
    const levelToUpdate = await prisma.level.create({ data: { name: "A mettre à jour" } });
    // - Il nous faut un body pour faire l'appel API
    const body = { name: "Nouveau nom du level" };

    // ACT
    // - Appel API
    await adminRequester.patch(`/levels/${levelToUpdate.id}`, body);

    // ASSERT
    // - Regarder dans la BDD si le niveau a été mis à jour
    const updatedLevel = await prisma.level.findUniqueOrThrow({ where: { id: levelToUpdate.id } });
    assert.equal(updatedLevel.id, levelToUpdate.id);
    assert.equal(updatedLevel.name, body.name);
    assert.notEqual(updatedLevel.updated_at, updatedLevel.created_at); // La date d'update a été mise à jour également
  });

  it("should return the updated level", async () => {
    // ARRANGE
    const levelToUpdate = await prisma.level.create({ data: { name: "A mettre à jour" } });
    const body = { name: "Nouveau nom du level" };

    // ACT
    const { status, data } = await adminRequester.patch(`/levels/${levelToUpdate.id}`, body);

    // ASSERT
    assert.equal(status, 200);
    assert.ok(data.id);
    assert.ok(data.created_at);
    assert.ok(data.updated_at);
    assert.equal(data.name, body.name);
  });

  it("should return a 404 when the requested level does not exist", async () => {
    // ARRANGE
    const unexistingLevelId = 42;
    const body = { name: "Nouveau nom" };

    // ACT
    const { status } = await adminRequester.patch(`/levels/${unexistingLevelId}`, body);

    // ASSERT
    assert.equal(status, 404);
  });

  it("should return a 409 if the target name is already taken", async () => {
    // ARRANGE
    const levelToUpdate = await prisma.level.create({ data: { name: "A mettre à jour" } });
    await prisma.level.create({ data: { name: "Déjà pris" } });
    const body = { name: "Déjà pris" };

    // ACT
    const { status } = await adminRequester.patch(`/levels/${levelToUpdate.id}`, body);
    
    // ASSERT
    assert.equal(status, 409);
  });

  // Stock le comportement initial de la fonction (pour pouvoir le remettre après)
  const prismaLevelUpdate = prisma.level.update;

  it("should return a 500 status if an database error occures", async () => {
    // ARRANGE
    // - modifier le comportement de la fonction prisma.level.update() pour qu'elle lève une erreur
    prisma.level.update = () => { throw new Error("Une erreur sauvage de base de données est apparue !"); };

    const levelToUpdate = await prisma.level.create({ data: { name: "A mettre à jour" } });
    const body = { name: "Nouveau nom du level" };

    // ACT
    const { status, data } = await adminRequester.patch(`/levels/${levelToUpdate.id}`, body);

    // ASSERT
    // - cette erreur renvoie bien une 500
    assert.equal(status, 500);
    assert.equal(data.error, "Unexpected server error");

    // CLEAN UP
    // - remettre le comportement initial de la fonction
    prisma.level.update = prismaLevelUpdate;
  });
});
