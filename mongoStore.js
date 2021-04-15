const { MongoClient } = require('mongodb');
const { logger } = require('./logger');
const { getSemInv, semList } = require('./validator');
class MongoStore {
    client;
    gradeDB;
    constructor() {
        this.init();
    }
    async init() {
        const uri = process.env.MONGO_URL;
        if (this.client && this.client.isConnected())
            return true;
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await this.client.connect();
            this.gradeDB = this.client.db("makautdb").collection("gradecard");
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }
    async close() {
        await this.client.close();
        this.client = null;
    }
    async fetch(roll, sems, callback) {
        if (!this.client || !this.client.isConnected())
            await this.init();
        let proj = { '_id': 0 }
        const invSem = getSemInv(sems)
        for (let i = 0; i < invSem.length; i++) {
            proj[invSem[i]] = 0;
        }
        this.gradeDB.findOne({ '_id': roll }, { projection: proj })
            .then(results => {
                // console.log(results)
                callback(results);
            })
            .catch(error => {
                console.error(error);
                callback([]);
            });
    }
    async update(jsonObj) {
        if (!this.client || !this.client.isConnected())
            await this.init();
        await this.gradeDB.
            updateOne({ '_id': parseInt(jsonObj.roll) }, { $set: jsonObj }, { upsert: true }, (err, res) => {
                //console.log(res);
            })
    }
    async fetchRange(start, end, sems, callback) {
        if (!this.client || !this.client.isConnected())
            await this.init();
        let proj = { '_id': 0 }
        const invSem = getSemInv(sems)
        for (let i = 0; i < invSem.length; i++) {
            proj[invSem[i]] = 0;
        }
        await this.gradeDB.find(
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
    async fetchMyAss(resultObject, callback) {
        if (!this.client || !this.client.isConnected())
            await this.init();

        let resObj = {}
        /*this.gradeDB.aggregate([
                {$match:{"SM02.BSCH201":{$exists:true}}},
                {$project:{_id: 0,marks: "$SM02.BSCH201.CGPA"}}]).toArray().then(res=>{logger.log(res)});*/

        for (let key in resultObject) {
            if (semList.includes(key)) {
                for (let subCode in resultObject[key]) {
                    //logger.log(subCode);
                    await this.countDistintMarks(key, subCode).then(data=>{
                        resObj[subCode] = data;
                        //logger.log(data)
                    }).catch(err=>{
                        resObj[subCode] = data;
                    })
                }
            }
        }
        return callback(resObj);
    }
    async countDistintMarks(semCode, subCode) {
        if (!this.client || !this.client.isConnected())
            await this.init();
        return new Promise((resolve, reject) => {
            this.gradeDB.aggregate([
                { $match: { [semCode + "." + subCode]: { $exists: true } } },
                { $group: { _id: '$' + semCode + '.' + subCode + '.CGPA', count: { $sum: 1 } } },
                { $project: { _id: 0, CGPA: '$_id', count: 1 } }
            ]).toArray(function (err, data) {
                err ? reject([]) : resolve(data);
            });
        });
    }
}
module.exports.MongoStore = MongoStore;
