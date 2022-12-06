import { describe, expect, test } from "@jest/globals";
import Worker from "./../helpers/worker.js";

const defaultOptions = {
  path: "./",
  encoding: "utf8",
};

const worker = Worker(defaultOptions);
const TEST_NAME = "TestComponent";

function makeTemplate(tagName, props = []) {
  const propsLine = props.map(({ name, value }) => `p-${name}="${value}"`);
  return `<${tagName} ${propsLine.join(" ")} />`;
}

describe("Test props throwing", () => {
  test("Correct empty props", () => {
    const template = makeTemplate(TEST_NAME);
    expect(worker.parseProps(template)).toStrictEqual({});
  });

  test("Correct simple initialization", () => {
    const props = {
      input: [
        {
          name: "name",
          value: "Alex",
        },
        {
          name: "age",
          value: "22",
        },
      ],
      output: {
        single: {
          name: "Alex",
        },
        multiply: {
          name: "Alex",
          age: "22",
        },
      },
    };

    const singlePropTemplate = makeTemplate(TEST_NAME, [props.input[0]]);
    const multiplyPropsTemplate = makeTemplate(TEST_NAME, props.input);

    expect(worker.parseProps(singlePropTemplate)).toEqual(props.output.single);
    expect(worker.parseProps(multiplyPropsTemplate)).toEqual(
      props.output.multiply
    );
  });

  test("Not equal quote", () => {
    const template = makeTemplate(TEST_NAME, [
      {
        name: "prop",
        value: `"`,
      },
    ]);

    expect(worker.parseProps(template)).toEqual({
      prop: "",
    });
  });
});
