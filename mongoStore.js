const { MongoClient } = require('mongodb');
const { getSemInv } = require('./validator');
const uri = "mongodb+srv://snowfox:WxiEseAAYgFnyFuG@snowfox.2wc0z.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";//process.env.MONGO_URL;
let client;
let gradeDB;
module.exports.init = async function init() {
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
module.exports.close = async function close() {
    await this.client.close();
    this.client = null;
}
module.exports.fetch = async function fetch(roll, sems, callback) {
    if (!this.client || !this.client.isConnected())
        await this.init();
    let proj = {'_id':0}
    const invSem = getSemInv(sems)
    for(let i = 0; i < invSem.length; i++){
        proj[invSem[i]] = 0;
    }
    await this.gradeDB.findOne({'_id':roll},{projection:proj})
        .then(results => {
           // console.log(results)
           callback(results);
        })
        .catch(error => console.error(error));
}
module.exports.update = async function update(jsonObj) {
    if (!this.client || !this.client.isConnected())
        await this.init();
    await this.gradeDB.
        updateOne({ '_id': parseInt(jsonObj.roll) }, { $set: jsonObj },{ upsert: true }, (err, res) => {
            //console.log(res);
        })
}
module.exports.fetchRange = async function fetchRange(start, end, sems, callback) {
    if (!this.client || !this.client.isConnected())
        await this.init();
    let proj = {'_id':0}
    const invSem = getSemInv(sems)
    for(let i = 0; i < invSem.length; i++){
        proj[invSem[i]] = 0;
    }
    await this.gradeDB.find(
        { $and:[ 
            { '_id': { $gte : start } }, 
            { '_id': { $lte : end   } }
        ]},
        {projection:proj})
    .toArray().then(results => {
        //console.log("Found",results.length,"roll in MongoDB");
        callback(results);
    })
    .catch(error => {
        console.error(error);
        callback([]);
    });
}