const request = require('request');
const JSDom = require('./node_modules/jsdom')
const fs = require('fs');
const main = require('./index');
const pdfExt = require('./dataExtractor');
PDFParser = require("./node_modules/pdf2json");

let cookieJar = request.jar();

module.exports.getCsrfToken = async function (callback) {
    request.get({ url: 'https://makaut1.ucanapply.com/smartexam/public/result-details', jar: cookieJar }, (error, response, body) => {
        console.log('statusCode:', response && response.statusCode, 'error:', error); 
        jsDom = new JSDom.JSDOM(body);
        element = jsDom.window.document.querySelectorAll("meta[name='csrf-token'")[0];
        return element ? callback(element.getAttribute("content")) : callback(undefined);
    });
};
module.exports.getMarkSheetPDF = async function (csrf, roll, callback) {

    let formData = {
        _token: csrf,
        p1: '',
        ROLLNO: roll,
        SEMCODE: 'SM01',
        examtype: 'result-details',
        all: ''
    };
    request.post({ url: 'https://makaut1.ucanapply.com/smartexam/public/download-pdf-result', jar: cookieJar , form:formData, encoding: null}, 
    (error, response, body) => {
        if(response && response.statusCodeatus != 200){
            let pdfParser = new PDFParser(this,1);
            pdfParser.parseBuffer(body);
            pdfParser.on("pdfParser_dataReady", pdfData => 
                callback(pdfExt.getTextArray(pdfData.formImage.Pages[0].Texts))
            );
        }
        else {
            callback({error: "Our server's CSRF token was expried/mis-matched, please try again"});
            main.resetCSRF();
        }
    });
};
