const request = require('request');
const JSDom = require('./node_modules/jsdom')
const main = require('./index');
const pdfExt = require('./dataExtractor');
const PDFParser = require("./node_modules/pdf2json");
const DB = require('./mongoStore')

let cookieJar = request.jar();

module.exports.getCsrfToken = async function () {
    return new Promise((resolve,reject)=>{
        request.get({ url: 'https://makaut1.ucanapply.com/smartexam/public/result-details', jar: cookieJar }, (error, response, body) => {
            if(error)
                console.log('statusCode:', response && response.statusCode, 'error:', error); 
            let jsDom = new JSDom.JSDOM(body);
            element = jsDom.window.document.querySelectorAll("meta[name='csrf-token'")[0];
            return element ? resolve(element.getAttribute("content")) : resolve(null);
        });
    })
};

module.exports.getMarkSheetPDF = async function (csrf, sem, roll, callback) {

    let formData = {
        _token: csrf,
        p1: '',
        ROLLNO: roll,
        SEMCODE: sem,
        examtype: 'result-details',
        all: ''
    };
    request.post({ url: 'https://makaut1.ucanapply.com/smartexam/public/download-pdf-result', jar: cookieJar , form:formData, encoding: null}, 
    (error, response, body) => {
        if(response && response.statusCodeatus != 200){
            let pdfParser = new PDFParser();
            pdfParser.parseBuffer(body);
            pdfParser.on("pdfParser_dataError", errData => {callback({info:"Records not found", error:errData.parserError}); main.resetCSRF();});
            pdfParser.on("pdfParser_dataReady", pdfData => callback(pdfExt.getTextArray(pdfData.formImage.Pages[0].Texts, sem)));
        }
        else {
            console.log("FOXERROR",response.statusCodeatus, body);
            callback({info: "Our server boy was caught smuggling marksheet by the professors, please try again",error:"CSRF-MISMATCH"});
        }
        if(error){
            console.log("FOXERROR",error);
            callback({info: "Error",error:"UNKNOWN"});
        }
    });
};
