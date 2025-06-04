import PDFParser from 'pdf2json';
import * as fs from 'fs';

export async function getPDFContents(pdfFilePath) {
    let pdfParser = new PDFParser();
    return new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData) =>
        reject(errData.parserError)
      );
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        resolve(pdfData);
      });
  
      pdfParser.loadPDF(pdfFilePath);
    });
  }

export async function removeFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }
      
        console.log(`File ${filePath} has been successfully removed.`);
      });
}

export function firstOfNextMonth() {
    var d = new Date();
    d.setMonth(d.getMonth()+1, 1);
    return d.toLocaleDateString("it-IT");
}


export function getToday() {
    var d = new Date();
    return d.toLocaleDateString("it-IT");
}