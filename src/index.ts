import { logger } from "./logger";
import * as fs from "fs";
import * as path from "node:path";
import { SAST } from "./parser/SAST";
import { Filenames } from "./interfaces/EFilenames";
import { ContainerScanning } from "./parser/ContainerScanning";
import { SecretDetection } from "./parser/SecretDetection";

logger.info("Starting parser Script...");
logger.info(`Current working directory: '${process.cwd()}'`);
console.log("Listing CWD... (at: " + process.cwd());
console.log(fs.readdirSync(process.cwd()));
console.log("Listing '/'...");
console.log(fs.readdirSync("/"));

/*function searchFile(dir: string, fileName: string) {
  // read the contents of the directory
  const files = fs.readdirSync(dir);

  // search through the files
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(dir, file);

    // get the file stats
    const fileStat = fs.statSync(filePath);

    // if the file is a directory, recursively search the directory
    if (fileStat.isDirectory()) {
      searchFile(filePath, fileName);
    } else if (file.endsWith(fileName)) {
      // if the file is a match, print it
      console.log(filePath);
    }
  }
}*/
console.log(process.env);
// start the search in the current directory
// searchFile(process.env.CI_PROJECT_DIR!, Filenames.CONTAINER);
// searchFile(process.env.CI_PROJECT_DIR!, Filenames.SAST);
// searchFile(process.env.CI_PROJECT_DIR!, Filenames.SECRET);
console.log(process.env.CI_PROJECT_DIR);
try {
  console.log(fs.readdirSync(process.env.CI_PROJECT_DIR!));
} catch (e) {
  console.log(e);
}
//check SAST file

const build_dir = process.env.CI_PROJECT_CIR || "";
const fileNamePaths = {
  sast: path.join(build_dir, Filenames.SAST),
  secret_detection: path.join(build_dir, Filenames.SECRET),
  container_scanning: path.join(build_dir, Filenames.CONTAINER),
};

const sast_exists = fs.existsSync(fileNamePaths.sast);
logger.info("SAST File not found. Skipping.");
const container_exists = fs.existsSync(fileNamePaths.container_scanning);
logger.info("Container Scanning File not found. Skipping.");
const secret_exists = fs.existsSync(fileNamePaths.secret_detection);
logger.info("Secret Detection File not found. Skipping.");

//run
let sast_result;
if (sast_exists) {
  const scan = new SAST(fileNamePaths.sast);
  const result = scan.parse();
  console.log(result);
  sast_result = result;
}

//generate exit code
if (sast_result?.error) process.exitCode = 1;

let container_result;
if (container_exists) {
  const scan = new ContainerScanning(fileNamePaths.container_scanning);
  const result = scan.parse();
  console.log(result);
  container_result = result;
}

//generate exit code
if (container_result?.error) process.exitCode = 1;

let secret_result;
if (secret_exists) {
  const scan = new SecretDetection(fileNamePaths.secret_detection);
  const result = scan.parse();
  console.log(result);
  secret_result = result;
}

//generate exit code
if (secret_result?.error) process.exitCode = 1;
