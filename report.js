const { generate } = require ("cucumber-html-reporter");

const options ={
     theme:'bootstrap',
     jsonFile:'report/report.json',
     output:'report/cucumber-html-report.html',
     reportSuiteAsScenaros:true,
     launchReport:false,
}
generate(options)