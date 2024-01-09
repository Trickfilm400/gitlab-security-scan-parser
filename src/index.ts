import { logger } from "./logger";
import * as fs from "fs";
import * as path from "node:path";
import { SAST } from "./parser/SAST";
import { Filenames } from "./interfaces/EFilenames";
import { ContainerScanning } from "./parser/ContainerScanning";
import { SecretDetection } from "./parser/SecretDetection";

logger.info("Starting parser Script...");
logger.info(`Current working directory: '${process.cwd()}'`);
logger.debug("Listing CWD... :: at: " + process.cwd());
logger.debug(JSON.stringify(fs.readdirSync(process.cwd())));

logger.debug(
  "Using build project directory from CI: " + process.env.CI_PROJECT_DIR,
);

const build_dir = process.env.CI_PROJECT_DIR || "";
const fileNamePaths = {
  sast: path.join(build_dir, Filenames.SAST),
  secret_detection: path.join(build_dir, Filenames.SECRET),
  container_scanning: path.join(build_dir, Filenames.CONTAINER),
};
logger.debug("Using files in::");
logger.debug(JSON.stringify(fileNamePaths));

const sast_exists = fs.existsSync(fileNamePaths.sast);
const container_exists = fs.existsSync(fileNamePaths.container_scanning);
const secret_exists = fs.existsSync(fileNamePaths.secret_detection);

//run
if (sast_exists) {
  const scan = new SAST(fileNamePaths.sast);
  const result = scan.parse();
  if (result.error) {
    logger.warn("SAST Detection Errors:");
    process.exitCode = 1;
  } else {
    logger.info("SAST Detection Result:");
  }
  console.log(result);
} else {
  logger.info("SAST File not found. Skipping.");
}

if (container_exists) {
  const scan = new ContainerScanning(fileNamePaths.container_scanning);
  const result = scan.parse();
  if (result.error) {
    logger.warn("Container Scanning Errors:");
    process.exitCode = 1;
  } else {
    logger.info("Container Scanning Result:");
  }
  console.log(result);
} else {
  logger.info("Container Scanning File not found. Skipping.");
}

if (secret_exists) {
  const scan = new SecretDetection(fileNamePaths.secret_detection);
  const result = scan.parse();
  if (result.error) {
    logger.warn("Secret Detection Errors:");
    process.exitCode = 1;
  } else {
    logger.info("Secret Detection Result:");
  }
  console.log(result);
} else {
  logger.info("Secret Detection File not found. Skipping.");
}
