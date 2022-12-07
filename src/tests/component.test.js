const { describe, expect, test } = require("@jest/globals");
const Worker = require("./../helpers/worker.js");

const defaultOptions = {
  path: "./src",
  encoding: "utf8",
};

const worker = Worker(defaultOptions);

describe("Validate components", () => {
  test("Find only html & htm format", () => {
    const components = worker.components().map(({ format }) => format);
    expect(
      components.every((item) => ["html", "htm"].includes(item))
    ).toBeTruthy();
  });

  test("Only CamelCase filenames", () => {
    const components = worker.components().map(({ name }) => name);
    expect(
      components.every((item) => item[0] === item[0].toUpperCase())
    ).toBeTruthy();
  });
});
