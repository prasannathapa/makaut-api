# Maulana Abul Kalam Azad University of Technology
_____
## How does it work

### ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) [`MAKAUT RESULT API`](https://makaut-api.herokuapp.com/)

![](./working.png)

- It is a **NodeJS** based Grade Card API with **CSRF authentication bypassing** and **Result auto Caching functionality**. 

- It updates the **SESSION** and **CSRF TOKEN** with MAKAUT server per requested roll number (while session and CSRF token in requesting every semester for an individual roll - number remains the same), making all genrated requestes less prone to getting blocked.

- **The Result Caching equiped with Parrallel Request Calls** makes it one of the **FASTEST** opensource Bulk-Result-Scrapper of MAKAUT.
If you find anything faster then this :wink: feel free to open an issue to make it faster!

- Since I have hosted in Heroku with a free dyno, the `request timeout` is 30sec. If it fails to process your request within 30secs It will give you of all the results that it could parse withing the given time with an extra json field "info" at the end and continues to Cache your request even after the response so that it can give you results even faster then before. 

Example
```
{...
    ...
      "30000118020" : {....},
      "30000118021" : {....},
      "30000118022" : {....},
      "info" : {
                queryTotal: 89,
                queryProcessed: 80,
                cause: "this is due to the limitations of heroku server of 30sec timeout",
                fix: "Try sending the Request again as the server would cache all of the results in its database for faster access and to minimize the load on makaut server. If this persists then try to reduce the range",
                tip: "Give valid semesters in which results actally exists, all unpublished results are taken from MAKAUT server or Break your range into 2 halfs"
       }
}
```

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
- 🎁 **Analytics Roll numbers**
    - **different CGPA `per selected semester` count of all students in the same course** that are present in mongoDB
    - **different CGPA `per subject in selected semesters` count of all students having the same subject** that are present in mongoDB

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
`https://makaut-api.herokuapp.com/30000118020/43`
```
{
  "SM03": {
    "ESC301": {
      "subjectName": "Analog and Digital Electronics",
      "CGPA": "10",
      "grade": "O",
      "weightage": "3.0"
    },
    "PCC-CS301": {
      "subjectName": "Data Structure & Algorithms",
      "CGPA": "8",
      "grade": "A",
      "weightage": "3.0"
    },
    "PCC-CS302": {
      "subjectName": "Computer Organisation",
      "CGPA": "7",
      "grade": "B",
      "weightage": "3.0"
    },
    "BSC301": {
      "subjectName": "Mathematics-III (Differential Calculus)",
      "CGPA": "8",
      "grade": "A",
      "weightage": "2.0"
    },
    "HSMC301": {
      "subjectName": "Economics for Engineers (Humanities-II)",
      "CGPA": "9",
      "grade": "E",
      "weightage": "3.0"
    },
    "PCC-CS393": {
      "subjectName": "IT Workshop (Sci Lab/MATLAB/Python/R)",
      "CGPA": "10",
      "grade": "O",
      "weightage": "2.0"
    },
    "ES-CS391": {
      "subjectName": "Analog and Digital Electronics Lab",
      "CGPA": "10",
      "grade": "O",
      "weightage": "2.0"
    },
    "PCC-CS391": {
      "subjectName": "Data Structure & Algorithms Lab",
      "CGPA": "10",
      "grade": "O",
      "weightage": "2.0"
    },
    "PCC-CS392": {
      "subjectName": "Computer Organisation Lab",
      "CGPA": "10",
      "grade": "O",
      "weightage": "2.0"
    }
  },
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
  },
  "collegeName": "MAKAUT, WB(300)",
  "name": "PRASANNA THAPA",
  "registration": "183000110021 OF 2018-2019",
  "results": {
    "SM03": "9.00",
    "SM04": "9.71"
  },
  "roll": "30000118020"
}
```
##### RANGED RESPONSE
`https://makaut-api.herokuapp.com/30000118020/30000118025/4`
```
{
   "30000118020": {
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
      },
      "collegeName": "MAKAUT, WB(300)",
      "name": "PRASANNA THAPA",
      "registration": "183000110021 OF 2018-2019",
      "results": {
         "SM04": "9.71"
      },
      "roll": "30000118020"
   },
   "30000118021": {
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
      },
      "collegeName": "MAKAUT, WB(300)",
      "name": "PRAKASH KUMAR",
      "registration": "183000110020 OF 2018-2019",
      "results": {
         "SM04": "9.67"
      },
      "roll": "30000118021"
   },
   "30000118022": {
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
         "BSC 401": {
            "subjectName": "Biology",
            "CGPA": "6",
            "grade": " C ",
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
      },
      "collegeName": "MAKAUT, WB(300)",
      "name": "PANKAJ KUMAR",
      "registration": "183000110019 OF 2018-2019",
      "results": {
         "SM04": "8.90"
      },
      "roll": "30000118022"
   },
   "30000118023": {
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
      },
      "collegeName": "MAKAUT, WB(300)",
      "name": "NUTAN HOTWANI",
      "registration": "183000110018 OF 2018-2019",
      "results": {
         "SM04": "9.67"
      },
      "roll": "30000118023"
   },
   "30000118024": {
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
      },
      "collegeName": "MAKAUT, WB(300)",
      "name": "MD SUHAIL KHAN",
      "registration": "183000110017 OF 2018-2019",
      "results": {
         "SM04": "9.19"
      },
      "roll": "30000118024"
   },
   "30000118025": {
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
      },
      "collegeName": "MAKAUT, WB(300)",
      "name": "KUMAR RANJAN",
      "registration": "183000110016 OF 2018-2019",
      "results": {
         "SM04": "9.71"
      },
      "roll": "30000118025"
   }
}
```
# Subject Analytics
`http://makaut-api.herokuapp.com/analytics/subjects/30000118020/3`
```
{
  "SM03": {
    "ESC301": [
      {
        "count": 253,
        "CGPA": "5"
      },
      {
        "count": 158,
        "CGPA": "9"
      },
      {
        "count": 416,
        "CGPA": "8"
      },
      {
        "count": 474,
        "CGPA": "7"
      },
      {
        "count": 89,
        "CGPA": "2"
      },
      {
        "count": 379,
        "CGPA": "6"
      },
      {
        "count": 15,
        "CGPA": "10"
      }
    ],
    "PCC-CS301": [
      {
        "count": 405,
        "CGPA": "7"
      },
      {
        "count": 186,
        "CGPA": "6"
      },
      {
        "count": 78,
        "CGPA": "10"
      },
      {
        "count": 22,
        "CGPA": "2"
      },
      {
        "count": 78,
        "CGPA": "5"
      },
      {
        "count": 547,
        "CGPA": "8"
      },
      {
        "count": 469,
        "CGPA": "9"
      }
    ],
    "PCC-CS302": [
      {
        "count": 486,
        "CGPA": "7"
      },
      {
        "count": 47,
        "CGPA": "10"
      },
      {
        "count": 284,
        "CGPA": "6"
      },
      {
        "count": 35,
        "CGPA": "2"
      },
      {
        "count": 118,
        "CGPA": "5"
      },
      {
        "count": 523,
        "CGPA": "8"
      },
      {
        "count": 291,
        "CGPA": "9"
      }
    ],
    "BSC301": [
      {
        "count": 225,
        "CGPA": "9"
      },
      {
        "count": 379,
        "CGPA": "6"
      },
      {
        "count": 124,
        "CGPA": "10"
      },
      {
        "count": 117,
        "CGPA": "2"
      },
      {
        "count": 265,
        "CGPA": "5"
      },
      {
        "count": 315,
        "CGPA": "8"
      },
      {
        "count": 359,
        "CGPA": "7"
      }
    ],
    "HSMC301": [
      {
        "count": 564,
        "CGPA": "7"
      },
      {
        "count": 317,
        "CGPA": "6"
      },
      {
        "count": 20,
        "CGPA": "10"
      },
      {
        "count": 10,
        "CGPA": "2"
      },
      {
        "count": 82,
        "CGPA": "5"
      },
      {
        "count": 552,
        "CGPA": "8"
      },
      {
        "count": 239,
        "CGPA": "9"
      }
    ],
    "PCC-CS393": [
      {
        "count": 736,
        "CGPA": "10"
      },
      {
        "count": 563,
        "CGPA": "9"
      },
      {
        "count": 29,
        "CGPA": "6"
      },
      {
        "count": 6,
        "CGPA": "2"
      },
      {
        "count": 2,
        "CGPA": "5"
      },
      {
        "count": 355,
        "CGPA": "8"
      },
      {
        "count": 93,
        "CGPA": "7"
      }
    ],
    "ES-CS391": [
      {
        "count": 609,
        "CGPA": "10"
      },
      {
        "count": 67,
        "CGPA": "7"
      },
      {
        "count": 22,
        "CGPA": "6"
      },
      {
        "count": 7,
        "CGPA": "2"
      },
      {
        "count": 4,
        "CGPA": "5"
      },
      {
        "count": 312,
        "CGPA": "8"
      },
      {
        "count": 763,
        "CGPA": "9"
      }
    ],
    "PCC-CS391": [
      {
        "count": 156,
        "CGPA": "7"
      },
      {
        "count": 588,
        "CGPA": "10"
      },
      {
        "count": 52,
        "CGPA": "6"
      },
      {
        "count": 6,
        "CGPA": "2"
      },
      {
        "count": 3,
        "CGPA": "5"
      },
      {
        "count": 381,
        "CGPA": "8"
      },
      {
        "count": 599,
        "CGPA": "9"
      }
    ],
    "PCC-CS392": [
      {
        "count": 698,
        "CGPA": "9"
      },
      {
        "count": 316,
        "CGPA": "8"
      },
      {
        "count": 120,
        "CGPA": "7"
      },
      {
        "count": 4,
        "CGPA": "2"
      },
      {
        "count": 14,
        "CGPA": "6"
      },
      {
        "count": 632,
        "CGPA": "10"
      }
    ]
  }
}
```
# CGPA Analytics
`http://makaut-api.herokuapp.com/analytics/cgpa/30000118020/3`
```
{
  "SM03": [
    {
      "count": 24,
      "CGPA": "8.86"
    },
    {
      "count": 1,
      "CGPA": "5.24"
    },
    {
      "count": 11,
      "CGPA": "6.90"
    },
    {
      "count": 1,
      "CGPA": "3.68"
    },
    {
      "count": 1,
      "CGPA": "5.07"
    },
    {
      "count": 21,
      "CGPA": "8.36"
    },
    {
      "count": 1,
      "CGPA": "2.97"
    },
    {
      "count": 1,
      "CGPA": "4.95"
    },
    {
      "count": 1,
      "CGPA": "4.55"
    },
    {
      "count": 13,
      "CGPA": "7.18"
    },
    {
      "count": 4,
      "CGPA": "6.73"
    },
    {
      "count": 1,
      "CGPA": "5.05"
    },
    {
      "count": 6,
      "CGPA": "7.21"
    },
    {
      "count": 5,
      "CGPA": "6.14"
    },
    {
      "count": 2,
      "CGPA": "4.93"
    },
    {
      "count": 1,
      "CGPA": "5.93"
    },
    {
      "count": 18,
      "CGPA": "8.91"
    },
    {
      "count": 10,
      "CGPA": "6.91"
    },
    {
      "count": 15,
      "CGPA": "6.95"
    },
    {
      "count": 15,
      "CGPA": "6.59"
    },
    {
      "count": 27,
      "CGPA": "8.73"
    },
    {
      "count": 12,
      "CGPA": "6.64"
    },
    {
      "count": 14,
      "CGPA": "7.68"
    },
    {
      "count": 19,
      "CGPA": "8.95"
    },
    {
      "count": 8,
      "CGPA": "6.79"
    },
    {
      "count": 7,
      "CGPA": "8.31"
    },
    {
      "count": 5,
      "CGPA": "9.59"
    }.....
}
```

# Project Author

- #### [`PRASANNA THAPA`](https://prasanna-thapa.herokuapp.com/)
### Project Contributors 
- ###### Be one by forking the project and give a pull request!

