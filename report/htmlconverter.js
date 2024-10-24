import { generate } from 'cucumber-html-reporter';

const options ={
     theme:'bootstrap',
     jsonFile:'report/report.json',
     output:'report/cucumber-html-report.html',
     reportSuiteAsScenarios:true,
     launchReport:true,
     screenshotsDirectory: 'report/screenshots/',
     storeScreenshots: true
}
generate(options)