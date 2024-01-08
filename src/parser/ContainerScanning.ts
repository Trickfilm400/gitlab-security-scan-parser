import { IParser } from "../interfaces/IParser";
import * as fs from "fs";
import { logger } from "../logger";
import { Filenames } from "../interfaces/EFilenames";

export class ContainerScanning implements IParser {
  private data: {
    scan: never;
    version: string;
    vulnerabilities: Array<{ message: string }>;
    remediations: Array<{ summary: string }>;
  };
  constructor(filename: string = Filenames.CONTAINER) {
    this.loadFile(filename);
  }
  loadFile(filename: string) {
    try {
      const string = fs.readFileSync(filename).toString("utf-8");
      this.data = JSON.parse(string);
    } catch (e) {
      logger.error(e);
      console.error(e);
    }
  }
  parse() {
    if (!this.data) {
      return {
        error: true,
        error_message: "No parsed data found for Container Scanning file.",
      };
    }
    if (
      this.data.vulnerabilities.length > 0 ||
      this.data.remediations.length > 0
    ) {
      return {
        error: true,
        error_count:
          this.data.vulnerabilities.length + this.data.remediations.length,
        error_message: "Found Container Scanning vulnerabilities",
        error_details: this.data.vulnerabilities
          .map((e) => e.message)
          .concat(this.data.remediations.map((e) => e.summary)),
      };
    }
    //else
    return {
      error: false,
      error_count: 0,
      error_message: "Nothing found.",
    };
  }
}
