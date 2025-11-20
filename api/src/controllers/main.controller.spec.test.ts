import assert from "node:assert";
import { describe, it } from "node:test";

const apiBaseUrl = `http://localhost:${process.env.PORT}/api`; // 7357

describe("[GET] /api/health", () => {
  it("should return a 'true' status", async () => {
    // ACT : appel API 
    const httpResponse = await fetch(`${apiBaseUrl}/health`);
    const body = await httpResponse.json();

    // ASSERT
    assert.ok(body.status);
  });

  it("should return all other required properties", async () => {
    // ACT
    const httpResponse = await fetch(`${apiBaseUrl}/health`);
    const body = await httpResponse.json();

    // ASSERT
    assert.ok(body.ip);
    assert.ok(body.date);
    assert.ok(body.headers);
  });
});
