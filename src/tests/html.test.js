import fs from "fs";
import { describe, expect, test } from "@jest/globals";
import Worker from "./../helpers/worker.js";

function getExampleFile() {
  return fs.readFileSync("src/Example.html").toString();
}

const defaultOptions = {
  path: "./src",
  encoding: "utf8",
};

const worker = Worker(defaultOptions);

describe("Validate HTML Markup", () => {
  test("Use exist component", () => {
    const file = getExampleFile();
    const isExistCamelCase = worker
      .components()
      .some(({ name }) => file.includes(name));

    expect(isExistCamelCase).toBeTruthy();
  });
});
