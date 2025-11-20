import { describe, it } from "node:test";
import { buildSlug } from "./slug.ts";
import assert from "node:assert";

describe("buildSlug", () => {
  it("should return the slug for the sentence", () => {
    // ARRANGE
    const sentence = "Play Station 5 500Go Light à petit prix";

    // ACT
    const result = buildSlug(sentence);

    // ASSERT
    assert.equal(result, "play-station-5-500go-light-à-petit-prix");
  });
});
