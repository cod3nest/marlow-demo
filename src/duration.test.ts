import { describe, expect, test } from "bun:test";
import { formatDuration, parseDuration } from "./duration";

describe("parseDuration", () => {
  test("reads each unit", () => {
    expect(parseDuration("250ms")).toBe(250);
    expect(parseDuration("30s")).toBe(30_000);
    expect(parseDuration("5m")).toBe(300_000);
    expect(parseDuration("2h")).toBe(7_200_000);
  });

  test("accepts compound durations", () => {
    expect(parseDuration("1h30m")).toBe(5_400_000);
    expect(parseDuration("2m15s")).toBe(135_000);
    expect(parseDuration("1h30m45s")).toBe(5_445_000);
    expect(parseDuration("1h500ms")).toBe(3_600_500);
  });

  test("rejects repeated units in compound durations", () => {
    expect(() => parseDuration("1h2h")).toThrow("Invalid duration");
    expect(() => parseDuration("1m2m")).toThrow("Invalid duration");
  });

  test("rejects out-of-order units in compound durations", () => {
    expect(() => parseDuration("30m1h")).toThrow("Invalid duration");
    expect(() => parseDuration("15s2m")).toThrow("Invalid duration");
  });

  test("rejects garbage", () => {
    expect(() => parseDuration("soon")).toThrow("Invalid duration");
    expect(() => parseDuration("")).toThrow("Invalid duration");
  });
});

describe("formatDuration", () => {
  test("picks the largest whole unit", () => {
    expect(formatDuration(250)).toBe("250ms");
    expect(formatDuration(30_000)).toBe("30s");
    expect(formatDuration(300_000)).toBe("5m");
  });
});
