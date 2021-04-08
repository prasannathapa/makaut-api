const express = require('./node_modules/express')
const check = require('./validator');
const exam = require('./exam');

let csrfToken;
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

    sendResponse(sem, roll, responseObject => {
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
    if (!check.isRoll(rollBeg) || !check.isRoll(rollEnd) || (rollEnd - rollBeg) > 120 || !check.isSemSingle(sem)) {
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
    let responseObject = {};
    let callBackCount = 0; //variable are syncronous
    for (let itr = rollBeg; itr <= rollEnd; itr++) {
        sendResponse(sem, itr.toString(), result => {
            callBackCount++;
            responseObject[itr.toString()] = result
            console.log(sem, itr, callBackCount);
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
async function sendResponse(semList, roll, callback) {
    let responseObject = {};
    let callBackCount = 0;
    for (let i in semList) {
        const sem = semList[i];
        exam.getCsrfToken(token => {
            csrfToken = token
            exam.getMarkSheetPDF(csrfToken, sem, roll, async (data) => {
                //await data.forEach(val => res.write(val + ",\n"))
                callBackCount++;
                if (data.name && !responseObject.name) responseObject.name = data.name;
                if (data.roll && !responseObject.roll) responseObject.roll = data.roll;
                if (data.registration && !responseObject.registration) responseObject.registration = data.registration;
                if (data.collegeName && !responseObject.collegeName) responseObject.collegeName = data.collegeName;
                if (!data.error)
                    responseObject[sem] = data.result;
                else
                    responseObject[sem] = { info: data.info };
               //if (data.error && data.error == "CSRF-MISMATCH")
                   // sendResponse([sem], roll, callback);
                if (callBackCount == semList.length) {
                    callback(responseObject);
                }
            });
        });

    }
}
app.get('/restart', function (req, res, next) {
    process.exit(1);
});
app.get('/reset', function (req, res) {
    csrfToken = "";
    console.log(csrfToken)
    res.send("Done!! " + csrfToken);
});
app.listen(port, () => {
    console.log("server started at http://localhost:" + port);

});

module.exports.resetCSRF = () => {
    csrfToken = null;
}
module.exports.reinitCSRF = () => {
    csrfToken = null;
    exam.getCsrfToken(token => { csrfToken = token });
}
