import { logger } from "./logger";
import * as fs from "fs";
import * as path from "node:path";
import { SAST } from "./parser/SAST";
import { Filenames } from "./interfaces/EFilenames";
import { ContainerScanning } from "./parser/ContainerScanning";
import { SecretDetection } from "./parser/SecretDetection";
import * as dir from "node-dir";

logger.info("Starting parser Script...");
logger.info(`Current working directory: '${process.cwd()}'`);
console.log("Listing CWD...");
console.log(fs.readdirSync(process.cwd()));
console.log("Listing '/'...");
console.log(fs.readdirSync("/"));
try {
  console.log(
    fs
      .readdirSync("/")
      .slice(1)
      .map((e) => fs.readdirSync("/" + e)),
  );
} catch (e) {
  console.log(e);
}
console.log(fs.readdirSync(path.join("/builds")));
function searchFile(dir: string, fileName: string) {
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
}

// start the search in the current directory
searchFile("/builds", Filenames.CONTAINER);
searchFile("/", Filenames.CONTAINER);
dir.files("/builds", function (err, content) {
  if (err) throw err;
  console.log("content:", content);
  console.log(JSON.stringify(content));
});
dir.files("/home", function (err, content) {
  if (err) throw err;
  console.log("content:", content);
  console.log(JSON.stringify(content));
});
//check SAST file

const sast_exists = fs.existsSync(path.join(process.cwd(), Filenames.SAST));
logger.info("SAST File not found. Skipping.");
const container_exists = fs.existsSync(
  path.join(process.cwd(), Filenames.CONTAINER),
);
logger.info("Container Scanning File not found. Skipping.");
const secret_exists = fs.existsSync(path.join(process.cwd(), Filenames.SECRET));
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
