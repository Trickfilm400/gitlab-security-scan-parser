# gitlab-security-scan-parser


## About this project
This script is designed to improve the experience in GitLab Free and GitLab Premium with the Application Testing Templates for the CI/CD Pipelines.
There are some provided templates for code-scanner which scan you application for leaking security tokens or perform SAST.
These scanners output a JSON file, but in the GitLab Free & Premium tier they will not be shown in Merge Requests - the files are only an artifact and will not processed in any way.
Because of the rising security topic on applications,
this project aims to improve this experience and security by reading and parsing the JSON files inside a CI/CD job and giving a simple output for the user to interpret,
if the scanners have found something.


## Usage
```yaml
# enable pah reporting for downloadable files (todo: add expire date)
stages:
  - test
  - post
.sast-analyzer:
  artifacts:
    expire_in: 1 week
    paths:
      - gl-sast-report.json
.secret-analyzer:
  artifacts:
    expire_in: 1 week
    paths:
      - gl-secret-detection-report.json
gl-testing-parser:
  image: ghcr.io/trickfilm400/gitlab-security-scan-parser:master
  allow_failure: true
  stage: post
  needs:
    - container_scanning
    - semgrep-sast
    - secret_detection
  script:
    # debugging info
    - ls -lah
    - npm start
```

### Future features and ideas (contributions welcome)
- [ ] add html report (for gitlab pages or whatever)
- [ ] add more report files (DAST Scanning / Premium Scanner)
- [ ] improve parsing of data (ignore specific vulnerabilities or whatever)
- [ ] add configuration for en/-disable specific test files on purpose

&copy; 2024

Created with ♥ by [typescript-project-scaffolding](https://github.com/Trickfilm400/typescript-project-scaffolding)