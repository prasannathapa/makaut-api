const express = require('./node_modules/express')
const fs = require('fs');
const path = require('path');
const exam = require('./exam');
const { send } = require('process');

let csrfToken;
const port = process.env.PORT || 8080;
const app = express();

app.get('/:id', function (req, res) {
    let roll = req.params.id;
    if (/^\d+$/.test(roll) == false) {
        res.end();
        return;
    }

    console.log("roll", roll)

    if (!csrfToken) {
        exam.getCsrfToken(token => {
            csrfToken = token
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            exam.getMarkSheetPDF(csrfToken, roll, async (data) => {
                await data.forEach(val => res.write(val + ",\n"))
                res.end("}");
            });
        })
    }
    else {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        exam.getMarkSheetPDF(csrfToken, roll, async (data) => {
            await data.forEach(val => res.write(val + ",\n"))
            res.end("}");
        });
    }
});

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