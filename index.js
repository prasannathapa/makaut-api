const express = require('./node_modules/express')
const fs = require('fs');
const path = require('path');
const exam = require('./exam');
const { send } = require('process');

let csrfToken;
const port = process.env.PORT || 8080;
const app = express();
const semCodes = [['SM01', 'SM02', 'SM03', 'SM04', 'SM05', 'SM06', 'SM07', 'SM08'],
                  ['SM01'], ['SM02'], ['SM03'], ['SM04'], ['SM05'], ['SM06'], ['SM07'], ['SM08']];
app.get('/:roll/:sem', function (req, res) {
    let roll = req.params.roll;
    let sem = req.params.sem;
    if (/^\d+$/.test(roll) == false || /^\d+$/.test(sem) == false || sem < 0 || sem > 8) {
        res.end();
        return;
    }
    sem = semCodes[sem];
    console.log("roll", roll)
    console.log("sem", sem)

    if (!csrfToken) {
        exam.getCsrfToken(token => {
            csrfToken = token
            sendResponse(res, sem, roll);
        })
    }
    else {
       sendResponse(res, sem, roll);
    }
});
function sendResponse(res, sem, roll){
    exam.getMarkSheetPDF(csrfToken, sem[0], roll, async (data) => {
        //await data.forEach(val => res.write(val + ",\n"))
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data,null,3));           
    });
}

app.get('/reset', function (req, res) {
    csrfToken = "";
    console.log(csrfToken)
    res.send("Done! " + csrfToken);
});
app.listen(port, () => {
    console.log("server started at http://localhost:" + port);

});

module.exports.resetCSRF = () => {
    exam.getCsrfToken(token => { csrfToken = token });
}