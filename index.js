const express = require('./node_modules/express')
const check = require('./validator');
const exam = require('./exam');
const DB = require('./mongoStore');
let csrfToken = {id:null,count:0}
const port = process.env.PORT || 8080;
const app = express();
app.get('/', function (req, res) {
    res.statusCode = 302;
    res.setHeader('Location', 'https://github.com/prasannathapa/makaut-api/blob/master/README.md');
    return res.end();
});
app.get('/:roll/:sem', function (req, res) {
    let roll = req.params.roll;
    let sem = req.params.sem;
    if (!check.isRoll(roll) || !check.isSem(sem)) {
        res.end();
        return;
    }
    sem = check.getSem(sem);
    console.log("roll", roll)
    console.log("sem", sem)

    sendResponse(sem, roll, {}, responseObject => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject, null, 3));
    });

});
app.get('/:rollbeg/:rollend/:sem', function (req, res) {
    let rollBeg = req.params.rollbeg;
    let rollEnd = req.params.rollend;
    let sem = req.params.sem;
    rollBeg = parseInt(rollBeg);
    rollEnd = parseInt(rollEnd);
    if (rollBeg > rollEnd)
        [rollBeg, rollEnd] = [rollEnd, rollBeg]
    if (!check.isRoll(rollBeg) || !check.isRoll(rollEnd) || (rollEnd - rollBeg) > 120 || !check.isSem(sem)) {
        res.end();
        return;
    }
    sem = check.getSem(sem);
    console.log("rollStart", rollBeg)
    console.log("rollEND", rollEnd)
    console.log("sem", sem)

    sendRangeResponse(sem, rollBeg, rollEnd, responseObject => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject, null, 3));
    });
});
async function sendRangeResponse(sem, rollBeg, rollEnd, callback) {
    let responseObject = {},backUpObj = {};
    let callBackCount = 0; //variable are syncronous
    await DB.fetchRange(rollBeg, rollEnd, data => {
        for (let itr = 0; itr < data.length; itr++) {
            const gradeCard = data[itr];
            backUpObj[gradeCard.roll] = gradeCard;
        }
    });
    for (let itr = rollBeg; itr <= rollEnd; itr++) {
        const roll_itr = itr.toString();
        sendResponse(sem, roll_itr, backUpObj, result => {
            callBackCount++;
            responseObject[roll_itr] = result
            if (callBackCount == (rollEnd - rollBeg + 1)) {
                const sortedResult = Object.keys(responseObject).sort().reduce((obj, key) => {
                    obj[key] = responseObject[key];
                    return obj;
                }, {});
                callback(sortedResult);
            }
        })
    }
}
async function sendResponse(semList, roll, backUp, callback) {
    let responseObject = {};
    let callBackCount = 0;
    for (let i in semList) {
        const sem = semList[i];
        if (backUp[roll] && backUp[roll][sem] && !backUp[roll][sem].info) {
            callBackCount++;
            responseObject = backUp[roll];
            if (callBackCount == semList.length) {
                callback(responseObject);
            }
        }
        else {
            let token = await exam.getCsrfToken();
            exam.getMarkSheetPDF(token, sem, roll, (data) => {
                //await data.forEach(val => res.write(val + ",\n"))
                callBackCount++;
                console.log("GETTING DATA FROM MAKAUT SERVER: ", sem, roll, token,callBackCount);
               
                if (data.name && !responseObject.name) responseObject.name = data.name;
                if (data.roll && !responseObject.roll) responseObject.roll = data.roll;
                if (data.registration && !responseObject.registration) responseObject.registration = data.registration;
                if (data.collegeName && !responseObject.collegeName) responseObject.collegeName = data.collegeName;
                if (!data.error)
                    responseObject[sem] = data[sem];
                else
                    responseObject[sem] = { info: data.info };
                //if (data.error && data.error == "CSRF-MISMATCH")
                    //this.reinitCSRF();
                    //sendResponse([sem], roll, callback);
                if (callBackCount == semList.length) {
                    callback(responseObject);
                }
            });
            
        }
    }
}
app.get('/restart', function (req, res, next) {
    process.exit(1);
});
app.get('/reset', function (req, res) {
    csrfToken = {id:null,count:0};
    console.log(csrfToken)
    res.send("Done! " + csrfToken);
});
app.listen(port, () => {
    console.log("server started at http://localhost:" + port);
});

module.exports.resetCSRF = () => {
    csrfToken = {id:null,count:0};
}
module.exports.reinitCSRF = async function reinitCSRF(){
    csrfToken = {id:null,count:0};
    csrfToken.id = await exam.getCsrfToken();
}