const express = require('./node_modules/express')
const check = require('./utils/validator');
const exam = require('./connector/exam');
const DB = require('./datastore/mongoStore')
const { logger } = require('./logger/logger');
const request = require('request');
const { getCollegeAnalytics } = require('./Analytics/collegeAnalytics');
let csrfToken = { id: null, count: 0 }
const port = process.env.PORT || 8080;
const timeout = 29000;
const app = express();
DB.init();
process.on('exit', function () {
    logger.log('About to exit.');
    DB.close();
    process.exit(1);
});
process.on('SIGINT', function () {
    logger.log('About to exit.');
    DB.close();
    process.exit(1);
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
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
    sendSingleResponse(roll, sem).then(responseObject => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject, null, 2));
    }).catch(responseObject => {
        res.writeHead(206, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseObject, null, 2));
    });
});
app.get('/analytics/cgpa/:roll/:sem', function (req, res, next) {
    let roll = req.params.roll;
    let sem = req.params.sem;
    if (!check.isRoll(roll) || !check.isSem(sem)) {
        next();
        return;
    }
    sem = check.getSem(sem);
    sendSingleResponse(roll, sem)
        .then(responseObject => {
            if (responseObject.roll)
                DB.fetchAnalyticsCGPA(responseObject.results, responseObject.roll, analObj => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(analObj, null, 2));
                });
            else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ info: "roll number and semester combination not valid", error: '404' }, null, 2));
            }
        }).catch(responseObject => {
            res.writeHead(206, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseObject, null, 2));
        });

});
app.get('/analytics/subjects/:roll/:sem', function (req, res, next) {
    let roll = req.params.roll;
    let sem = req.params.sem;
    if (!check.isRoll(roll) || !check.isSem(sem)) {
        next();
        return;
    }
    sem = check.getSem(sem);
    sendSingleResponse(roll, sem)
        .then(responseObject => {
            if (responseObject.roll)
                DB.fetchAnalytics(responseObject, analObj => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(analObj, null, 2));
                });
            else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ info: "roll number and semester combination not valid", error: '404' }, null, 2));
            }
        }).catch(responseObject => {
            res.writeHead(206, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseObject, null, 2));
        });

});
async function sendSingleResponse(roll, sem) {
    return new Promise((resolve, reject) => {
        logger.log("GET REQ Roll:[", roll, "]", "sem:", sem)
        let backUpObj = {};
        let reqSaved = 0;
        setTimeout(() => {
            backUpObj.info = {
                queryTotal: sem.length,
                queryProcessed: reqSaved,
                cause: "this is due to the limitations of heroku server of 30sec timeout",
                fix: "Try sending the Request again as the server",
                tip: "This is bad, single query should not result in timeout. Try raising issue in its github page"
            };
            reject(backUpObj);
        }, timeout);
        DB.fetch(parseInt(roll), sem, gradeCard => {
            backUpObj[roll] = gradeCard;
            sem.forEach(s => {
                if (backUpObj[roll][s])
                    reqSaved++;
            });
            logger.log("Initial Req Size:[", sem.length, "] backup data:[", reqSaved, "]\n" +
                "New Request Size:[", sem.length - reqSaved, "]  effeciency: ", (reqSaved / sem.length) * 100 + "%");
            sendResponse(sem, roll, backUpObj, responseObject => resolve(sorted(responseObject)));
        });
    });

}
app.get('/analytics/college/:collegecode', function (req, res, next) {
    let collegeCode = req.params.collegecode;
    if (check.collegeCodes[collegeCode]) {
        logger.log("CollegeCode:[", collegeCode, "] CollegeName:[", check.collegeCodes[collegeCode], "] sending report")
        getCollegeAnalytics(collegeCode, data => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        });
    } else {
        next();
    }
});
app.get('/:rollbeg/:rollend/:sem', function (req, res, next) {
    let rollBeg = req.params.rollbeg;
    let rollEnd = req.params.rollend;
    let sem = req.params.sem;
    rollBeg = parseInt(rollBeg);
    rollEnd = parseInt(rollEnd);
    if (rollBeg > rollEnd)
        [rollBeg, rollEnd] = [rollEnd, rollBeg]
    if (!check.isRoll(rollBeg) || !check.isRoll(rollEnd) || (rollEnd - rollBeg) > 120 || !check.isSem(sem)) {
        next();
        return;
    }
    sem = check.getSem(sem);
    logger.log("GET REQ Roll:[", rollBeg, "to", rollEnd, "]", "sem:", sem, "\n",
        "Range Size:[", (rollEnd - rollBeg + 1), "] Total Request:[", (rollEnd - rollBeg + 1) * sem.length, "]")

    sendRangeResponse(sem, rollBeg, rollEnd)
        .then(responseObject => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseObject, null, 3));
        }).catch((responseObject) => {
            res.writeHead(206, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sorted(responseObject), null, 3));
        });
});
async function sendRangeResponse(sem, rollBeg, rollEnd) {
    return new Promise((resolve, reject) => {
        let responseObject = {}, backUpObj = {};
        let callBackCount = 0; //variable are syncronous
        const totalCount = (rollEnd - rollBeg + 1);
        const totalReqCount = totalCount * sem.length;
        let reqSaved = 0;
        setTimeout(() => {
            responseObject.info = {
                queryTotal: totalCount,
                queryProcessed: callBackCount,
                cause: "this is due to the limitations of heroku server of 30sec timeout",
                fix: "Try sending the Request again as the server would cache all of the results in its database for faster access and to minimize the load on makaut server. If this persists then try to reduce the range",
                tip: "Give valid semesters in which results actally exists, all unpublished results are taken from MAKAUT server or Break your range into 2 halfs"
            };
            reject(responseObject);
        }, timeout);
        DB.fetchRange(rollBeg, rollEnd, sem, data => {
            //GET BACKUP DATA
            for (let itr = 0; itr < data.length; itr++) {
                const gradeCard = data[itr];
                backUpObj[gradeCard.roll] = gradeCard;
                sem.forEach(s => {
                    if (data[itr][s])
                        reqSaved++;
                });
            }
            logger.log("Initial Req Size:[", totalReqCount, "] backup data:[", reqSaved, "] data\n" +
                "New Request Size:[", totalReqCount - reqSaved, "]  effeciency: ", (reqSaved / totalReqCount) * 100 + "%");
            //GET SERVER DATA
            for (let itr = rollBeg; itr <= rollEnd; itr++) {
                const roll_itr = itr.toString();
                sendResponse(sem, roll_itr, backUpObj, result => {
                    callBackCount++;
                    logger.log("Building Response Progress: " + (callBackCount / totalCount) * 100 + "%");
                    responseObject[roll_itr] = result
                    if (callBackCount == totalCount) {
                        resolve(sorted(responseObject));
                    }
                })
            }
        });
    })
}
function sorted(jsonObj) {
    const sortedResult = Object.keys(jsonObj).sort().reduce((obj, key) => {
        obj[key] = jsonObj[key];
        return obj;
    }, {});
    return sortedResult;
}
async function sendResponse(semList, roll, backUp, callback) {
    const cookieJar = request.jar();
    await exam.getCsrfToken(cookieJar).then(token => {
        let responseObject = {};
        let callBackCount = 0;
        for (let i in semList) {
            const sem = semList[i];
            if (backUp[roll] && backUp[roll][sem] && !backUp[roll][sem].info) {
                callBackCount++;
                responseObject = backUp[roll];
                if (responseObject.results)
                    responseObject.results = sorted(responseObject.results)
                if (callBackCount == semList.length) {
                    callback(sorted(responseObject));
                }
            }
            else {
                exam.getMarkSheetPDF(token, sem, roll, cookieJar, (data) => {
                    //await data.forEach(val => res.write(val + ",\n"))
                    callBackCount++;
                    logger.log("GETTING DATA FROM MAKAUT SERVER: ", sem, roll, token);

                    if (data.name && !responseObject.name) responseObject.name = data.name;
                    if (data.roll && !responseObject.roll) responseObject.roll = data.roll;
                    if (data.registration && !responseObject.registration) responseObject.registration = data.registration;
                    if (data.collegeName && !responseObject.collegeName) responseObject.collegeName = data.collegeName;
                    if (data.results && !responseObject.results)
                        responseObject.results = data.results;
                    else if (responseObject.results && data.results)
                        responseObject.results = Object.assign(responseObject.results, data.results);
                    if (!data.error)
                        responseObject[sem] = data[sem];
                    else
                        responseObject[sem] = { info: data.info };
                    //if (data.error && data.error == "CSRF-MISMATCH")
                    //this.reinitCSRF();
                    //sendResponse([sem], roll, callback);
                    if (callBackCount == semList.length) {
                        if (responseObject.results)
                            responseObject.results = sorted(responseObject.results);
                        callback(sorted(responseObject));
                    }
                });
            }
        }
    });
}


app.get('/restart', function (req, res) {
    process.exit(1);
});
app.use(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end("{error:\"Cannot process your request\", info:\"Invalid Query\"}");
});
app.get('/subjectCodes',function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end("{subjectCodes:"+JSON.stringify(check.subjectCodes)+"}");
})
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
