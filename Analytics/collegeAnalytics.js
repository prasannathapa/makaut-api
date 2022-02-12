const { logger } = require('../logger/logger');
const { collegeCodes, semList } = require('../utils/validator');
const DB = require('../datastore/mongoStore')

function solveCollegeData(data) {

    let resultObj = {
        subjectMap: {},
        data: {},
        studentCount: {}
    };

    for (let student of data) {
        let batch = "20" + student.roll.substr(6, 2);
        let course = student.roll.substr(3, 3);
        if (!resultObj.data[batch])
            resultObj.data[batch] = {};
        if (!resultObj.data[batch][course])
            resultObj.data[batch][course] = {};

        if (!resultObj.studentCount[batch])
            resultObj.studentCount[batch] = {};
        if (!resultObj.studentCount[batch][course])
            resultObj.studentCount[batch][course] = {};

        for (let sem in student) {
            let hasBackLogs = false;
            if (semList.includes(sem)) {
                if (!resultObj.studentCount[batch][course][sem])
                    resultObj.studentCount[batch][course][sem] = { "pass": 0, "fail": 0, "total": 0 };
                resultObj.studentCount[batch][course][sem].total++;
                for (let subjects in student[sem]) {
                    if (!resultObj.data[batch][course][sem])
                        resultObj.data[batch][course][sem] = [];
                    let found = false;
                    for (let i in resultObj.data[batch][course][sem]) {
                        if (resultObj.data[batch][course][sem][i].code == subjects) {
                            let cgpa = parseFloat(student[sem][subjects].CGPA);
                            resultObj.data[batch][course][sem][i].cgpa.push(cgpa);

                            resultObj.data[batch][course][sem][i].highestCGPA =
                                Math.max(resultObj.data[batch][course][sem][i].highestCGPA, cgpa);

                            resultObj.data[batch][course][sem][i].lowestCGPA =
                                Math.min(resultObj.data[batch][course][sem][i].lowestCGPA, cgpa);

                            if (cgpa <= 2) {
                                hasBackLogs = true;
                                resultObj.data[batch][course][sem][i].fail++;
                            }
                            else {
                                resultObj.data[batch][course][sem][i].pass++
                            }

                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        let cgpa = parseFloat(student[sem][subjects].CGPA);
                        resultObj.data[batch][course][sem].push({
                            "code": subjects,
                            "pass": cgpa < 4 ? 0 : 1,
                            "fail": cgpa < 4 ? 1 : 0,
                            "highestCGPA": cgpa,
                            "lowestCGPA": cgpa,
                            "cgpa": [cgpa]
                        });
                        if (cgpa <= 2)
                            hasBackLogs = true;
                        resultObj.subjectMap[subjects] = student[sem][subjects].subjectName;
                    }
                }
                if (!hasBackLogs)
                    resultObj.studentCount[batch][course][sem].pass++;
                else
                    resultObj.studentCount[batch][course][sem].fail++;
            }
        }
    }
    for (let batch in resultObj.data) {
        for (let course in resultObj.data[batch]) {
            for (let sem in resultObj.data[batch][course]) {
                for (let subject in resultObj.data[batch][course][sem]) {
                    let averageCGPA = resultObj.data[batch][course][sem][subject].cgpa.reduce((acc, v, i, a) => (acc + v / a.length), 0);
                    let standardDeviation = Math.sqrt(array.map(x => Math.pow(x - averageCGPA, 2)).reduce((a, b) => a + b) / n)
                    delete resultObj.data[batch][course][sem][subject].cgpa;
                    resultObj.data[batch][course][sem][subject].averageCGPA = averageCGPA.toFixed(2);
                    resultObj.data[batch][course][sem][subject].standardDeviation = standardDeviation.toFixed(2);
                }
            }
            resultObj.data[batch][course] = Object.keys(resultObj.data[batch][course]).sort().reduce(
                (obj, key) => {
                    obj[key] = resultObj.data[batch][course][key];
                    return obj;
                },
                {}
            )
        }
        resultObj.data[batch] = Object.keys(resultObj.data[batch]).sort().reduce(
            (obj, key) => {
                obj[key] = resultObj.data[batch][key];
                return obj;
            },
            {}
        )
    }
    return resultObj;
}
module.exports.getCollegeAnalytics = (collegeCode, callback) => {
    const filter = {
        'roll': {
            '$regex': new RegExp('^' + collegeCode)
        }
    };
    const projection = {
        'roll': 1,
        '_id': 0,
        'SM01': 1,
        'SM02': 1,
        'SM03': 1,
        'SM04': 1,
        'SM05': 1,
        'SM06': 1,
        'SM07': 1,
        'SM08': 1,
        'results': 1
    };
    DB.getData(projection, filter).then(data => {
        callback(solveCollegeData(data));
    }).catch(err => {
        callback(err);
    })

}