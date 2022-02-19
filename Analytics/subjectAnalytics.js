const { logger } = require('../logger/logger');
const { collegeCodes, semList } = require('../utils/validator');
const DB = require('../datastore/mongoStore')
const process = (data) => {
    let resObj = {};
    for (let item of data) {
        if (resObj[item.college] === undefined)
            resObj[item.college] = {};
        if (resObj[item.college][item.batch] === undefined)
            resObj[item.college][item.batch] = {
                "CGPA_DATA": []
            }
        resObj[item.college][item.batch].CGPA_DATA.push(Number(item.marks))
    }
    for (let college in resObj)
        for (let batch in resObj[college]) {
            let cgpa = resObj[college][batch].CGPA_DATA;
            let avg = cgpa.reduce((acc, v, i, a) => (acc + v / a.length), 0);
            let sd = Math.sqrt(cgpa.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / cgpa.length);
            resObj[college][batch].AVERAGE_CGPA = avg.toFixed(2)*1;
            resObj[college][batch].STANDARD_DEVIATION =  sd.toFixed(2)*1;
        }
    return resObj;
}
module.exports.getSubjectAnalytics = (subCode, semCode, callback) => {
    let agg = [
        { $match: { [semCode + '.' + subCode]: { $exists: true } } },
        {
            $project:
            {
                _id: 0,
                marks: "$" + [semCode + '.' + subCode] + ".CGPA",
                college: { $substr: ["$roll", 0, 3] },
                batch: { $substr: ["$roll", 6, 2] },
            }
        }]
    logger.log("SUBJECT ANALYTICS:", [semCode], [subCode])
    DB.getData(null, null, agg).then(data => {
        callback(process(data));
    }).catch(err => {
        callback({ info: "some error occoured", error: "my databased got recked with my messy code" });
    })

}