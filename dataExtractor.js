module.exports.getTextArray = (pdf) => {
    let textArray = [];
    pdf.forEach((val => {
        if(val.R && val.R.length > 0){
            textArray.push(decodeURIComponent(val.R[0].T));
        }
    }))
    let resObj={};
    for(let i = 0; i < textArray.length; i++){
        if(textArray[i].startsWith("NAME")){
            resObj.name = textArray[++i];
        }
        else if(textArray[i].startsWith("ROLL NO.")){
            resObj.roll = textArray[++i];
        }
        else if(textArray[i].startsWith("REGISTRATION NO")){
            resObj.registration  = textArray[++i];
        }
        else if(textArray[i] == 'O' ||
                textArray[i] == 'E' ||
                textArray[i] == 'A' ||
                textArray[i] == 'B' ||
                textArray[i] == 'C' ||
                textArray[i] == 'D' ||
                textArray[i] == 'F' ||
                textArray[i] == 'I'){
            //resObj.roll = textArray[++i];
            let subCode = ""
            if(isNaN(textArray[i-3]) && textArray[i-3] != "Points")
                subCode = textArray[i-3]
            subCode += textArray[i-2]
            if(!resObj.result) resObj.result = {};
            resObj.result[subCode] = {
                "subjectName":textArray[i-1],
                "CGPA":textArray[i+1],
                "grade":textArray[i],
                "weightage":textArray[i+2]
            }
            i+=2;
        }
        else if(textArray[i].startsWith("College / Institution")){
            resObj.collegeName = textArray[i].substring("College / Institution".length).trim();
        }
    }
    ////const fs = require('fs')
    ////fs.writeFile('result.json', JSON.stringify(resObj), 'utf8', ()=>{console.log("SAVED");});
    return resObj;
}