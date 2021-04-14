const DB = require('./mongoStore')
module.exports.getTextArray = (pdf,sem) => {
    let textArray = [];
    pdf.forEach((val => {
        if(val.R && val.R.length > 0){
            let str = decodeURIComponent(val.R[0].T);
            textArray.push(str);
            if(str.startsWith("No Records Found!"))
                return {info: "No Records Found"};
        }
    }))
    if(textArray.length <= 2){
        return {info:"No Records Found", error:"Result doesnt exist"};
    }
    //console.log(textArray);
    let resObj={};
    for(let i = 0; i < textArray.length; i++){
        const text = textArray[i].trim();
        if(textArray[i].startsWith("NAME")){
            resObj.name = textArray[++i];
        }
        else if(textArray[i].startsWith("ROLL NO.")){
            resObj.roll = textArray[++i];
        }
        else if(textArray[i].startsWith("REGISTRATION NO")){
            resObj.registration  = textArray[++i];
        }
        else if(text == 'O' ||
                text == 'E' ||
                text == 'A' ||
                text == 'B' ||
                text == 'C' ||
                text == 'D' ||
                text == 'F' ||
                text == 'I'){
            //resObj.roll = textArray[++i];
            let subCode = ""
            if(isNaN(textArray[i-3]) && textArray[i-3] != "Points")
                subCode = textArray[i-3]
            subCode += textArray[i-2]
            if(!resObj[sem]) resObj[sem] = {};
            resObj[sem][subCode] = {
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
    //const fs = require('fs')
    //fs.writeFile('result.json', JSON.stringify(pdf), 'utf8', ()=>{console.log("SAVED");});
    DB.update(resObj);
    return resObj;
}