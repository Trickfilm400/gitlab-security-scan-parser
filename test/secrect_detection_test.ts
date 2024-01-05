import * as assert from "node:assert";
import { SecretDetection } from "../src/parser/SecretDetection";

describe("Secret Detection Test", () => {
  it("should find errors", () => {
    const scan = new SecretDetection(
      "../test/exampleJsonFiles/secret-detection-example.json",
    );
    const result = scan.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
    assert.strictEqual(result.error_count, 5);
  });
  it("should find errors without file", () => {
    const scan = new SecretDetection(
      "../test/exampleJsonFiles/secret-detection-example-404.json",
    );
    const result = scan.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
  });
  it("should find no errors", () => {
    const scan = new SecretDetection(
      "../test/exampleJsonFiles/secret-detection-example-empty.json",
    );
    const result = scan.parse();
    console.log(result);
    assert.strictEqual(result.error, false);
    assert.strictEqual(result.error_count, 0);
  });
});
