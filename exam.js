const request = require('request');
const JSDom = require('./node_modules/jsdom')
const pdfExt = require('./dataExtractor');
const PDFParser = require("./node_modules/pdf2json");
const { logger } = require('./logger');
const sockets = {maxSockets:480}
module.exports.getCsrfToken = async function (sessionCookie) {
    return new Promise((resolve,reject)=>{
        request.get({ url: 'https://makaut1.ucanapply.com/smartexam/public/result-details', jar: sessionCookie,pool: sockets}, (error, response, body) => {
            if(error)
                logger.log('getCSRF ERROR statusCode:', response && response.statusCode, 'error:', error); 
            let jsDom = new JSDom.JSDOM(body);
            element = jsDom.window.document.querySelectorAll("meta[name='csrf-token'")[0];
            element ? resolve(element.getAttribute("content")) : resolve(null);
        });
    })
};

module.exports.getMarkSheetPDF = async function (csrf, sem, roll, sessionCookie, callback) {

    let formData = {
        _token: csrf,
        p1: '',
        ROLLNO: roll,
        SEMCODE: sem,
        examtype: 'result-details',
        all: ''
    };
    request.post({ 
        url: 'https://makaut1.ucanapply.com/smartexam/public/download-pdf-result', 
        jar:sessionCookie , 
        pool:sockets, 
        timeout:28000,
        form:formData, 
        encoding: null
    }, (error, response, body) => {
        if(response && response.statusCodeatus != 200){
            let pdfParser = new PDFParser();
            pdfParser.parseBuffer(body);
            pdfParser.on("pdfParser_dataError", errData => {callback({info:"Records not found", error:errData.parserError});});
            pdfParser.on("pdfParser_dataReady", pdfData => callback(pdfExt.getTextArray(pdfData.formImage.Pages[0].Texts, sem)));
        }
        else {
            logger.log("PDF ERROR",response, body);
            callback({info: "Our server boy was caught smuggling marksheet by the professors, please try again",error:"CSRF-MISMATCH"});
        }
        if(error){
            logger.log("PDF ERROR",error);
            callback({info: "Error",error:"UNKNOWN"});
        }
    });
};
