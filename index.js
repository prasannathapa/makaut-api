const express = require('./node_modules/express')
const check = require('./validator');
const exam = require('./exam');
const DB = require('./mongoStore');
const { logger } = require('./logger');
let csrfToken = { id: null, count: 0 }
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
    sendSingleResponse(roll, sem, responseObject => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject, null, 2));
    });
});
async function sendSingleResponse(roll, sem, callback) {
    logger.log("GET REQ Roll:[", roll, "]", "sem:", sem)
    let backUpObj = {};
    let reqSaved = 0;
    await DB.fetch(parseInt(roll), sem, gradeCard => {
        backUpObj[roll] = gradeCard;
        sem.forEach(s => {
            if(backUpObj[roll][s])
                reqSaved++;
        });
    });
    logger.log("Initial Req Size:[", sem.length, "] backup data:[", reqSaved, "]\n"+
                "New Request Size:[", sem.length - reqSaved, "]  effeciency: ", (reqSaved / sem.length) * 100+"%");
    sendResponse(sem, roll, backUpObj, responseObject => callback(responseObject));
}
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
    logger.log("GET REQ Roll:[", rollBeg, "to", rollEnd, "]", "sem:", sem, "\n",
        "Range Size:[", (rollEnd - rollBeg + 1), "] Total Request:[", (rollEnd - rollBeg + 1) * sem.length, "]")

    sendRangeResponse(sem, rollBeg, rollEnd, responseObject => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject, null, 3));
    });
});
async function sendRangeResponse(sem, rollBeg, rollEnd, callback) {
    let responseObject = {}, backUpObj = {};
    let callBackCount = 0; //variable are syncronous
    const totalCount = (rollEnd - rollBeg + 1);
    const totalReqCount = totalCount * sem.length;
    let reqSaved = 0;
    await DB.fetchRange(rollBeg, rollEnd, sem, data => {
        for (let itr = 0; itr < data.length; itr++) {
            const gradeCard = data[itr];
            backUpObj[gradeCard.roll] = gradeCard;
            sem.forEach(s => {
                if (data[itr][s])
                    reqSaved++;
            });
        }
    });
    logger.log("Initial Req Size:[", totalReqCount, "] backup data:[", reqSaved, "] data\n"+
                "New Request Size:[", totalReqCount - reqSaved, "]  effeciency: ", (reqSaved / totalReqCount) * 100+"%");
    for (let itr = rollBeg; itr <= rollEnd; itr++) {
        const roll_itr = itr.toString();
        sendResponse(sem, roll_itr, backUpObj, result => {
            callBackCount++;
            logger.log("Building Response Progress: " + (callBackCount / totalCount) * 100 + "%");
            responseObject[roll_itr] = result
            if (callBackCount == totalCount) {
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
            exam.getCsrfToken().then(token => {
                exam.getMarkSheetPDF(token, sem, roll, (data) => {
                    //await data.forEach(val => res.write(val + ",\n"))
                    callBackCount++;
                    logger.log("GETTING DATA FROM MAKAUT SERVER: ", sem, roll, token);

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
            });
        }
    }
}
app.get('/restart', function (req, res, next) {
    process.exit(1);
});
app.get('/reset', function (req, res) {
    csrfToken = { id: null, count: 0 };
    logger.log(csrfToken)
    res.send("Done! " + csrfToken);
});
app.listen(port, () => {
    logger.log("server started at http://localhost:" + port);
});

module.exports.resetCSRF = () => {
    csrfToken = { id: null, count: 0 };
}
module.exports.reinitCSRF = async function reinitCSRF() {
    csrfToken = { id: null, count: 0 };
    csrfToken.id = await exam.getCsrfToken();
}