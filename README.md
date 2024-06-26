# UX testing
A repository designed to gather tests that simulate the user experience on the Piattaforma Unitaria portal.

## Installation

- Cucumber js: ```npm install --save-dev @cucumber/cucumber```
- Playwright: ```npm init playwright@latest```
- Report: ```npm install cucumber-junit-convert --save-dev``` & ```npm install cucumber-html-reporter --save-dev```

## Test execution
Execute ```npm run tests```, defining a script in package.json like:
```json
"scripts": {
    "tests": "cucumber-js -f json:report/report.json & node ./report/xmlconverter.js",
    "tests:local": "cucumber-js -f json:report/report.json & node ./report/htmlconverter.js"
} 
```

## Project structure

- ```features```: contains all scenarios related to the functionality of the portal
- ```features\step```: contains all the steps that define the scenario
- ```setup```: contains file with *hooks*, that are used for setup and teardown of the environment before and after each scenario
- ```config```: contains secrets file template and config to retrieve all secrets variables from env
- ```report```: contains the converters to get test results in xml or html and also the package where screenshots are created in case of test failure