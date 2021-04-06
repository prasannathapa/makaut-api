# Maulana Abul Kalam Azad University of Technology
_____
### ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) [`MAKAUT RESULT API`](https://makaut-api.herokuapp.com/)

It is a **NodeJS** based result scrapper with CSRF authentication bypassing, CSRF blocking recovery functionality

## Features
- 🎁 **JSON of the result of a `SINGLE` university roll number**
  - Single semester
  - Multiple Semesters 
  - All semesters

- 🎁 **JSON of the result for `RANGED` Roll numbers**
  - Single Semester [specified in queiry]
  - Multi Semester 
     -- can be achieved by changing
        `!check.isSemSingle(sem)` to `!check.isSem(sem)`
        in **index.js** however it would take too much time ( > 60 sec) to make connection timeout for my free heroku server

## API calls
-----
>It's so simple that you dont even need a GET query pram for that
   
#### Single Roll Number
```javascript
https://localhost:8080/[ROLL NUMBER]/[SEMS]
```
**Some Examples**
(_Here `30000118020` is taken as roll number_)
SEMS | Meaning | API Call (URL) 
------|------- |---
 `0` | All Semesters form 1 to 8|[`http://localhost:8080/30000118020/0`](https://makaut-api.herokuapp.com/30000118020/0)
 `1` | Semester 1|[`http://localhost:8080/30000118020/1`](https://makaut-api.herokuapp.com/30000118020/1)
 `2` | Semester 2|[`http://localhost:8080/30000118020/2`](https://makaut-api.herokuapp.com/30000118020/2)
 `3241` | Semester 3|[`http://localhost:8080/30000118020/3241`](https://makaut-api.herokuapp.com/30000118020/3241)
 `245`|Semester 2, 4 and 5 Combined | [`http://localhost:8080/30000118020/245`](https://makaut-api.herokuapp.com/30000118020/245)
 `12345678`|Same as `0`, All sems from 1 to 8 | [`http://localhost:8080/30000118020/12345678`](https://makaut-api.herokuapp.com/30000118020/12345678)
 #### Range Roll Numbers
 ```
https://localhost:8080/[START ROLL NUMBER]/[END ROLL NUMBER]/[SEMS]
```
**More Examples**
(_Here `30000118007` and `30000118043` is taken as roll number range_)
STARTING ROLL NUMBER|ENDING ROLL NUMBER|SEMS | Meaning | API Call (URL) 
----|-----|-----|------- |---
30000118007|30000118043| `1` | All sem 1 Results form roll 30000118007 to 30000118043|[`http://localhost:8080/30000118020/30000118043/1`](https://makaut-api.herokuapp.com/30000118020/30000118043/1)
30000118007 |300001180020|`0` | Invalid as `0` is disabled in ranged roll numbers. Change `!check.isSemSingle(sem)` to `!check.isSem(sem)` in **index.js** to make it work|[`http://localhost:8080/30000118020/30000118043/0`](https://makaut-api.herokuapp.com/30000118020/30000118043/0)

# Response Example
------
##### SINGLE RESPONSE
`https://makaut-api.herokuapp.com/30000118020/4`
```
{
   "name": "PRASANNA THAPA",
   "roll": "30000118020",
   "registration": "183000110021 OF 2018-2019",
   "collegeName": "MAKAUT, WB(300)",
   "SM04": {
      "PCC-CS401": {
         "subjectName": "Discrete Mathematics",
         "CGPA": "10",
         "grade": "O",
         "weightage": "4.0"
      },
      "PCC-CS402": {
         "subjectName": "Computer Architecture",
         "CGPA": "10",
         "grade": "O",
         "weightage": "3.0"
      },
      "PCC-CS403": {
         "subjectName": "Formal Language & Automata Theory",
         "CGPA": "10",
         "grade": "O",
         "weightage": "3.0"
      },
      "PCC-CS404": {
         "subjectName": "Design & Analysis of Algorithms",
         "CGPA": "10",
         "grade": "O",
         "weightage": "3.0"
      },
      "BSC 401": {
         "subjectName": "Biology",
         "CGPA": "9",
         "grade": "E",
         "weightage": "3.0"
      },
      "MC401": {
         "subjectName": "Environmental Sciences",
         "CGPA": "9",
         "grade": "E",
         "weightage": "1.0"
      },
      "PCC-CS 492": {
         "subjectName": "Computer Architecture",
         "CGPA": "10",
         "grade": "O",
         "weightage": "2.0"
      },
      "PCC-CS494": {
         "subjectName": "Design & Analysis of Algorithms",
         "CGPA": "9",
         "grade": "E",
         "weightage": "2.0"
      }
   }
}
```
##### RANGED RESPONSE
`https://makaut-api.herokuapp.com/30000118020/30000118025/4`
```
    {
       "30000118020": {
          "name": "PRASANNA THAPA",
          "roll": "30000118020",
          "registration": "183000110021 OF 2018-2019",
          "collegeName": "MAKAUT, WB(300)",
          "SM04": {
             "PCC-CS401": {
                "subjectName": "Discrete Mathematics",
                "CGPA": "10",
                "grade": "O",
                "weightage": "4.0"
             },
             "PCC-CS402": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS403": {
                "subjectName": "Formal Language & Automata Theory",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS404": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "BSC 401": {
                "subjectName": "Biology",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "MC401": {
                "subjectName": "Environmental Sciences",
                "CGPA": "9",
                "grade": "E",
                "weightage": "1.0"
             },
             "PCC-CS 492": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "2.0"
             },
             "PCC-CS494": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             }
          }
       },
       "30000118021": {
          "name": "PRAKASH KUMAR",
          "roll": "30000118021",
          "registration": "183000110020 OF 2018-2019",
          "collegeName": "MAKAUT, WB(300)",
          "SM04": {
             "PCC-CS401": {
                "subjectName": "Discrete Mathematics",
                "CGPA": "10",
                "grade": "O",
                "weightage": "4.0"
             },
             "PCC-CS402": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS403": {
                "subjectName": "Formal Language & Automata Theory",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS404": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "BSC 401": {
                "subjectName": "Biology",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "MC401": {
                "subjectName": "Environmental Sciences",
                "CGPA": "8",
                "grade": "A",
                "weightage": "1.0"
             },
             "PCC-CS 492": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "2.0"
             },
             "PCC-CS494": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             }
          }
       },
       "30000118022": {
          "name": "PANKAJ KUMAR",
          "roll": "30000118022",
          "registration": "183000110019 OF 2018-2019",
          "collegeName": "MAKAUT, WB(300)",
          "SM04": {
             "PCC-CS401": {
                "subjectName": "Discrete Mathematics",
                "CGPA": "10",
                "grade": "O",
                "weightage": "4.0"
             },
             "PCC-CS402": {
                "subjectName": "Computer Architecture",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "PCC-CS403": {
                "subjectName": "Formal Language & Automata Theory",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS404": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "MC401": {
                "subjectName": "Environmental Sciences",
                "CGPA": "9",
                "grade": "E",
                "weightage": "1.0"
             },
             "PCC-CS 492": {
                "subjectName": "Computer Architecture",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             },
             "PCC-CS494": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             }
          }
       },
       "30000118023": {
          "name": "NUTAN HOTWANI",
          "roll": "30000118023",
          "registration": "183000110018 OF 2018-2019",
          "collegeName": "MAKAUT, WB(300)",
          "SM04": {
             "PCC-CS401": {
                "subjectName": "Discrete Mathematics",
                "CGPA": "10",
                "grade": "O",
                "weightage": "4.0"
             },
             "PCC-CS402": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS403": {
                "subjectName": "Formal Language & Automata Theory",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS404": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "BSC 401": {
                "subjectName": "Biology",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "MC401": {
                "subjectName": "Environmental Sciences",
                "CGPA": "8",
                "grade": "A",
                "weightage": "1.0"
             },
             "PCC-CS 492": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "2.0"
             },
             "PCC-CS494": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             }
          }
       },
       "30000118024": {
          "name": "MD SUHAIL KHAN",
          "roll": "30000118024",
          "registration": "183000110017 OF 2018-2019",
          "collegeName": "MAKAUT, WB(300)",
          "SM04": {
             "PCC-CS401": {
                "subjectName": "Discrete Mathematics",
                "CGPA": "10",
                "grade": "O",
                "weightage": "4.0"
             },
             "PCC-CS402": {
                "subjectName": "Computer Architecture",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "PCC-CS403": {
                "subjectName": "Formal Language & Automata Theory",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "PCC-CS404": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "BSC 401": {
                "subjectName": "Biology",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "MC401": {
                "subjectName": "Environmental Sciences",
                "CGPA": "9",
                "grade": "E",
                "weightage": "1.0"
             },
             "PCC-CS 492": {
                "subjectName": "Computer Architecture",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             },
             "PCC-CS494": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             }
          }
       },
       "30000118025": {
          "name": "KUMAR RANJAN",
          "roll": "30000118025",
          "registration": "183000110016 OF 2018-2019",
          "collegeName": "MAKAUT, WB(300)",
          "SM04": {
             "PCC-CS401": {
                "subjectName": "Discrete Mathematics",
                "CGPA": "10",
                "grade": "O",
                "weightage": "4.0"
             },
             "PCC-CS402": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS403": {
                "subjectName": "Formal Language & Automata Theory",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "PCC-CS404": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "10",
                "grade": "O",
                "weightage": "3.0"
             },
             "BSC 401": {
                "subjectName": "Biology",
                "CGPA": "9",
                "grade": "E",
                "weightage": "3.0"
             },
             "MC401": {
                "subjectName": "Environmental Sciences",
                "CGPA": "9",
                "grade": "E",
                "weightage": "1.0"
             },
             "PCC-CS 492": {
                "subjectName": "Computer Architecture",
                "CGPA": "10",
                "grade": "O",
                "weightage": "2.0"
             },
             "PCC-CS494": {
                "subjectName": "Design & Analysis of Algorithms",
                "CGPA": "9",
                "grade": "E",
                "weightage": "2.0"
             }
          }
       }
    }
```

# Project Author

- #### [`PRASANNA THAPA`](https://prasanna-thapa.herokuapp.com/)
### Project Contributors 
- ###### Be one by forking the project and give a pull request!

