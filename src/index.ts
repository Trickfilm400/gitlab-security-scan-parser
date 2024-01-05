import { logger } from "./logger";
import * as fs from "fs";
import * as path from "node:path";
import { SAST } from "./parser/SAST";
import { Filenames } from "./interfaces/EFilenames";
import { ContainerScanning } from "./parser/ContainerScanning";
import { SecretDetection } from "./parser/SecretDetection";

logger.info("Starting parser Script...");
//check SAST file

const sast_exists = fs.existsSync(path.join(__dirname, "..", Filenames.SAST));
logger.info("SAST File not found. Skipping.");
const container_exists = fs.existsSync(
  path.join(__dirname, "..", Filenames.CONTAINER),
);
logger.info("Container Scanning File not found. Skipping.");
const secret_exists = fs.existsSync(
  path.join(__dirname, "..", Filenames.SECRET),
);
logger.info("Secret Detection File not found. Skipping.");

//run
let sast_result;
if (sast_exists) {
  const scan = new SAST();
  const result = scan.parse();
  console.log(result);
  sast_result = result;
}

//generate exit code
if (sast_result?.error) process.exitCode = 1;

let container_result;
if (container_exists) {
  const scan = new ContainerScanning();
  const result = scan.parse();
  console.log(result);
  container_result = result;
}

//generate exit code
if (container_result?.error) process.exitCode = 1;

let secret_result;
if (secret_exists) {
  const scan = new SecretDetection();
  const result = scan.parse();
  console.log(result);
  secret_result = result;
}

//generate exit code
if (secret_result?.error) process.exitCode = 1;
