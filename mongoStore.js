const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;
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
module.exports.fetch = async function fetch(roll, sems) {
    if (!this.client || !this.client.isConnected())
        await this.init();
    await gradeDB.findOne({'_id':roll})
        .then(results => {
            console.log(results)
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
module.exports.fetchRange = async function fetchRange(start, end, callback) {
    if (!this.client || !this.client.isConnected())
        await this.init();
    await this.gradeDB.find(
        { $and:[ 
            { '_id': { $gte : start } }, 
            { '_id': { $lte : end   } }
        ]},
        {projection:{'_id':0}})
    .toArray().then(results => {
        console.log("Found",results.length,"roll in MongoDB");
        callback(results);
    })
    .catch(error => {
        console.error(error);
        callback([]);
    });
}