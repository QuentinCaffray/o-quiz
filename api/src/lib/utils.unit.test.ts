import { describe, it } from "node:test";
import { isComplexPassword } from "./utils.ts";
import assert from "node:assert";

// GROUPEMENT DE TESTS
describe("isComplexPassword", () => {

  // UN TEST UNITAIRE
  it("should return false when the password is too short", () => {
    // ARRANGE (mise en place des données utiles pour le test, préparation)
    const password = "T0to!";
  
    // ACT (exécution de la fonction que l'on souhaite tester)
    const result = isComplexPassword(password);
  
    // ASSERT (vérification du comportement)
    assert.equal(result, false);
  });

  it("should return false when the password does not contain a capital letter", () => {
    // ARRANGE
    const password = "h3llodublin!";
  
    // ACT
    const result = isComplexPassword(password);
  
    // ASSERT
    assert.equal(result, false);
  });

  it("should return false when the password does not contain a lowercased letter", () => {
    // ARRANGE
    const password = "H3LLODUBLIN!";
  
    // ACT
    const result = isComplexPassword(password);
  
    // ASSERT
    assert.equal(result, false);
  });

  it("should return false when the password does not contain a special character", () => {
    // ARRANGE
    const password = "H3lloDublin";
  
    // ACT
    const result = isComplexPassword(password);
  
    // ASSERT
    assert.equal(result, false);
  });

  it("should return false when the password does not contain a digit", () => {
    // ARRANGE
    const password = "HelloDublin";
  
    // ACT
    const result = isComplexPassword(password);
  
    // ASSERT
    assert.equal(result, false);
  });

  it("should return true when the password is complex", async () => {
    // ARRANGE
    const password = "H3lloDublin!";
  
    // ACT
    const result = isComplexPassword(password);
  
    // ASSERT
    assert.ok(result);
  });

  it("should accept 'lettre à accent' as special characters", () => {
    // ARRANGE
    const password = "H3llôDublin";
  
    // ACT
    const result = isComplexPassword(password);
  
    // ASSERT
    assert.equal(result, true);
  });
});

