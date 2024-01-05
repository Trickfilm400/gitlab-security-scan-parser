import { SAST } from "../src/parser/SAST";
import * as assert from "node:assert";

describe("SAST Testing", () => {
  it("should find errors", () => {
    const sast = new SAST("../test/exampleJsonFiles/sast-example.json");
    const result = sast.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
    assert.strictEqual(result.error_count, 3);
  });
  it("should find errors 2", () => {
    const sast = new SAST("../test/exampleJsonFiles/sast-example-eslint.json");
    const result = sast.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
    assert.strictEqual(result.error_count, 9);
  });
  it("should find errors without file", () => {
    const sast = new SAST(
      "../test/exampleJsonFiles/sast-example-eslint-404.json",
    );
    const result = sast.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
  });
  it("should find no errors", () => {
    const sast = new SAST("../test/exampleJsonFiles/sast-example-empty.json");
    const result = sast.parse();
    console.log(result);
    assert.strictEqual(result.error, false);
    assert.strictEqual(result.error_count, 0);
  });
});
