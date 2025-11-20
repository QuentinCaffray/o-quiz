import { describe, expect, it } from "vitest";
import { toReadableDate } from "./utils";

describe("toReadableDate", () => {
  it("should return the year", async () => {
    // ARRANGE
    const date = new Date("01/01/2025");
    
    // ACT
    const result = toReadableDate(date); // "mercredi 01 janvier 2025"

    // ASSERT
    expect(result).to.include("2025");
  });

  it("should return the name of the day in plain text in French", async () => {
    // ARRANGE
    const date = new Date("01/01/2025");

    // ACT
    const result = toReadableDate(date);

    // ASSERT
    expect(result).include.oneOf(["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]);
  });

  it("should return the date in a complete readable format", async () => {
    // ARRANGE
    const date = new Date("01/01/2025");

    // ACT
    const result = toReadableDate(date);

    // ASSERT
    expect(result).to.equal("mercredi 1 janvier 2025");
  });
});
