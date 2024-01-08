import * as assert from "node:assert";
import { ContainerScanning } from "../src/parser/ContainerScanning";

describe("Container Scanning Test", () => {
  it("should find errors", () => {
    const scan = new ContainerScanning(
      "./test/exampleJsonFiles/container-scanning-example.json",
    );
    const result = scan.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
    assert.strictEqual(result.error_count, 10);
  });
  it("should find errors without files", () => {
    const scan = new ContainerScanning(
      "./test/exampleJsonFiles/container-scanning-example-404.json",
    );
    const result = scan.parse();
    console.log(result);
    assert.strictEqual(result.error, true);
  });
  it("should find no errors", () => {
    const scan = new ContainerScanning(
      "./test/exampleJsonFiles/container-scanning-example-empty.json",
    );
    const result = scan.parse();
    console.log(result);
    assert.strictEqual(result.error, false);
    assert.strictEqual(result.error_count, 0);
  });
});
