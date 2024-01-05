import { IParser } from "../interfaces/IParser";
import * as fs from "fs";
import * as path from "node:path";
import { logger } from "../logger";
import { Filenames } from "../interfaces/EFilenames";

export class SecretDetection implements IParser {
  private data: {
    scan: never;
    version: string;
    vulnerabilities: Array<{ name: string }>;
  };
  constructor(filename: string = Filenames.SECRET) {
    this.loadFile(filename);
  }
  loadFile(filename: string) {
    try {
      const string = fs
        .readFileSync(path.join(__dirname, "..", filename))
        .toString("utf-8");
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
        error_message: "No parsed data found for Security Scan file.",
      };
    }
    if (this.data.vulnerabilities.length > 0) {
      return {
        error: true,
        error_count: this.data.vulnerabilities.length,
        error_message: "Found Security vulnerabilities",
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
