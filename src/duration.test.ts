import { describe, expect, test } from "bun:test";
import { formatDuration, parseDuration } from "./duration";

describe("parseDuration", () => {
  test("reads each unit", () => {
    expect(parseDuration("250ms")).toBe(250);
    expect(parseDuration("30s")).toBe(30_000);
    expect(parseDuration("5m")).toBe(300_000);
    expect(parseDuration("2h")).toBe(7_200_000);
  });

  test("rejects garbage", () => {
    expect(() => parseDuration("soon")).toThrow("Invalid duration");
  });
});

describe("formatDuration", () => {
  test("picks the largest whole unit", () => {
    expect(formatDuration(250)).toBe("250ms");
    expect(formatDuration(30_000)).toBe("30s");
    expect(formatDuration(300_000)).toBe("5m");
  });
});
