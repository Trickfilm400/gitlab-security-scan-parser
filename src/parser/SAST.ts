import * as fs from "fs";
import { logger } from "../logger";
import { IParser } from "../interfaces/IParser";
import { Filenames } from "../interfaces/EFilenames";

export class SAST implements IParser {
  private data: {
    scan: never;
    version: string;
    vulnerabilities: Array<{ name: string }>;
  };
  constructor(filename: string = Filenames.SAST) {
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
        error_message: "No parsed data found for SAST file.",
      };
    }
    if (this.data.vulnerabilities.length > 0) {
      return {
        error: true,
        error_count: this.data.vulnerabilities.length,
        error_message: "Found SAST vulnerabilities",
        error_details: this.data.vulnerabilities.map((e) => e.name),
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
