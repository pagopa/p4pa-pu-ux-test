import { convert } from 'cucumber-junit-convert';

const options = {
    inputJsonFile: 'report/report.json',
    outputXmlFile: 'report/junitreport.xml',
    featureNameAsClassName: true 
}

convert(options);