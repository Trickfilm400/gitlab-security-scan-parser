# gitlab-security-scan-parser


## About this project
This script is designed to improve the experience in GitLab Free and GitLab Premium with the Application Testing Templates for the CI/CD Pipelines.
There are some provided templates for code-scanner which scan you application for leaking security tokens or perform SAST.
These scanners output a JSON file, but in the GitLab Free & Premium tier they will not be shown in Merge Requests - the files are only an artifact and will not processed in any way.
Because of the rising security topic on applications,
this project aims to improve this experience and security by reading and parsing the JSON files inside a CI/CD job and giving a simple output for the user to interpret,
if the scanners have found something.



&copy; 2024

Created with ♥ by [typescript-project-scaffolding](https://github.com/Trickfilm400/typescript-project-scaffolding)