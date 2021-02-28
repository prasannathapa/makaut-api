module.exports.getTextArray = (pdf) => {
    textArray = [];
    pdf.forEach((val => {
        if(val.R && val.R.length > 0){
            textArray.push(decodeURIComponent(val.R[0].T));
        }
    }))
    return textArray;
}