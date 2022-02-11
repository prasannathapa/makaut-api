const { MongoClient } = require('../node_modules/mongodb');
const { logger } = require('../logger/logger');
const { getSemInv, semList } = require('../utils/validator');
const fs = require('fs')

const path = '/mongoPassword.txt'


let client, gradeDB;
module.exports.init = async function init() {
    let mongoURL = "xxx";
    try {mongoURL = fs.readFileSync(__dirname + path, 'utf8')} catch (err) {}
    const uri = process.env.MONGO_URL || mongoURL;
    if (client && client.isConnected())
        return true;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        logger.log("CONNECTION CONNECTED!!!!!!!!!!!!!!!!!!!!")
        gradeDB = client.db("makautdb").collection("gradecard");
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}
module.exports.close = async function close() {
    await client.close();
    client = null;
    logger.log("XXXXXX DISCONNECTED XXXXX")
}
module.exports.fetch = async function fetch(roll, sems, callback) {
    if (!client || !client.isConnected())
        await this.init();
    let proj = { '_id': 0 }
    const invSem = getSemInv(sems)
    for (let i = 0; i < invSem.length; i++) {
        proj[invSem[i]] = 0;
        proj['results.' + invSem[i]] = 0;
    }
    gradeDB.findOne({ '_id': roll }, { projection: proj })
        .then(results => {
            // console.log(results)
            callback(results);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}
module.exports.update = async function update(jsonObj, sem) {
    if (!client || !client.isConnected())
        await this.init();
    return new Promise((resolve, reject) => {
        gradeDB.
            updateOne({ '_id': parseInt(jsonObj.roll) },
                {
                    $set: {
                        name: jsonObj.name,
                        roll: jsonObj.roll,
                        collegeName: jsonObj.collegeName,
                        registration: jsonObj.registration,
                        ['results.' + sem]: jsonObj.results[sem],
                        [sem]: jsonObj[sem]
                    }
                },
                { upsert: true },
                (err, res) => {
                    //console.log(res);
                }).then(resolve()).catch(resolve());
    })
}
module.exports.fetchRange = async function fetchRange(start, end, sems, callback) {
    if (!client || !client.isConnected())
        await this.init();
    let proj = { '_id': 0 }
    const invSem = getSemInv(sems)
    for (let i = 0; i < invSem.length; i++) {
        proj[invSem[i]] = 0;
        proj['results.' + invSem[i]] = 0;
    }
    await gradeDB.find(
        {
            $and: [
                { '_id': { $gte: start } },
                { '_id': { $lte: end } }
            ]
        },
        { projection: proj })
        .toArray().then(results => {
            //console.log("Found",results.length,"roll in MongoDB");
            callback(results);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}
module.exports.fetchAnalyticsCGPA = async function fetchAnalyticsCGPA(inputObj, roll, callback) {
    logger.log("AnalyticsCGPA request", inputObj, roll)
    if (!client || !client.isConnected())
        await this.init();

    let resObj = {}
    /*gradeDB.aggregate([
            {$match:{"SM02.BSCH201":{$exists:true}}},
            {$project:{_id: 0,marks: "$SM02.BSCH201.CGPA"}}]).toArray().then(res=>{logger.log(res)});*/
    for (let sem in inputObj) {
        if (semList.includes(sem)) {
            await this.countDistintCGPA(roll.substr(3, 3), sem).then(data => {
                resObj[sem] = data;
                //logger.log(data)
            }).catch(info => {
                resObj[sem] = info;
            })
        }
    }
    callback(resObj)
}
module.exports.countDistintCGPA = async function countDistintCGPA(courseCode, semCode) {
    if (!client || !client.isConnected())
        await this.init();
    /*logger.log(JSON.stringify({ roll: { $regex: '...' + courseCode + '....' } }))
    logger.log(JSON.stringify({ $group: { _id: '$results.' + semCode, count: { $sum: 1 } } }))
    logger.log(JSON.stringify({ $project: { _id: 0, CGPA: '$_id', count: 1 } }))*/
    return new Promise((resolve, reject) => {
        gradeDB.aggregate([{
            $match: {
                roll: { $regex: '...' + courseCode + '....' },
                ['results.' + semCode]: { $exists: true }
            }
        },
        { $group: { _id: '$results.' + semCode, count: { $sum: 1 } } },
        { $project: { _id: 0, CGPA: '$_id', count: 1 } }
        ]).toArray(function (err, data) {
            err ? resolve([]) : resolve(data);
        });
    });
}
module.exports.fetchAnalytics = async function fetchAnalytics(resultObject, callback) {
    if (!client || !client.isConnected())
        await this.init();

    let resObj = {}
    /*gradeDB.aggregate([
            {$match:{"SM02.BSCH201":{$exists:true}}},
            {$project:{_id: 0,marks: "$SM02.BSCH201.CGPA"}}]).toArray().then(res=>{logger.log(res)});*/

    for (let key in resultObject) {
        if (semList.includes(key)) {

            for (let subCode in resultObject[key]) {
                //logger.log(subCode);
                if (subCode !== "info") {
                    if (!resObj[key])
                        resObj[key] = {};
                    await this.countDistintMarks(key, subCode).then(data => {
                        resObj[key][subCode] = data;
                        //logger.log(data)
                    }).catch(info => {
                        resObj[key][subCode] = info;
                    })
                }
            }
        }
    }
    return callback(resObj);
}
module.exports.countDistintMarks = async function countDistintMarks(semCode, subCode) {
    if (!client || !client.isConnected())
        await this.init();
    return new Promise((resolve, reject) => {
        gradeDB.aggregate([
            { $match: { [semCode + "." + subCode]: { $exists: true } } },
            { $group: { _id: '$' + semCode + '.' + subCode + '.CGPA', count: { $sum: 1 } } },
            { $project: { _id: 0, CGPA: '$_id', count: 1 } }
        ]).toArray(function (err, data) {
            err ? reject([]) : resolve(data);
        });
    });
}

module.exports.getData = async function getData(projection, filter) {
    if (!client || !client.isConnected())
        await this.init();
    return new Promise((resolve, reject) => {
        gradeDB.find(filter, { projection: projection }).toArray().then((result) => {
            resolve(result);
        });
    });

}