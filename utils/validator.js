module.exports.isRoll = (num) => {
    return /^\d+$/.test(num);
}
module.exports.isSem = (num) => {
    return /^([1-8]*|0)$/.test(num);
}
module.exports.isSemSingle = (num) => {
    return /^([1-8])$/.test(num);
}
const sems = ['SM01', 'SM02', 'SM03', 'SM04', 'SM05', 'SM06', 'SM07', 'SM08'];

module.exports.getSem = sem => {
    if (sem == '0')
        return sems.slice();
    let semList = [];
    sem = new Set(sem);
    sem.forEach(value => {
        semList.push(sems[value - 1]);
    });
    return semList;
}
module.exports.getSemInv = sem => {
    let semList = [];
    sem = new Set(sem);
    sems.forEach(value => {
        if (!sem.has(value))
            semList.push(value);
    });
    return semList;
}
module.exports.semList = sems;
const colleges = {
    100: "MAKAUT, WB (In House)",
    103: "HALDIA INSTITUTE OF TECHNOLOGY ICARE COMPLEX",
    104: "INSTITUTE OF ENGINEERING & MANAGEMENT",
    105: "BANKURA UNNAYANI INSTITUTE OF ENGINEERING",
    106: "MURSHIDABAD COLLEGE OF ENGINEERING & TECHNOLOGY",
    107: "COLLEGE OF ENGINEERING & MANAGEMENT",
    108: "ASANSOL ENGINEERING COLLEGE VIVEKANANDA SARANI",
    109: "NETAJI SUBHASH ENGINEERING COLLEGE",
    110: "GOVT. COLLEGE OF ENGG. & TEXTILE",
    111: "GOVT. COLLEGE OF ENGINEERING AND TEXTILE TECHNOLOGY",
    112: "GOVERNMENT COLLEGE OF ENGINEERING AND LEATHER TECHNOLOGY",
    113: "GOVERNMENT COLLEGE OF ENGINEERING & CERAMIC TECHNOLOGY",
    115: "B.P. PODDAR INSTITUTE OF MANAGEMENT & TECHNOLOGY",
    116: "MCKV INSTITUTE OF ENGINEERING COLLEGE",
    117: "RCC INSTITUTE OF INFORMATION TECHNOLOGY",
    118: "BIRBHUM INSTITUTE OF ENGINEERING",
    119: "SILIGURI INSTITUTE OF TECHNOLOGY HILL CART ROAD",
    120: "DR. B. C. ROY ENGINEERING COLLEGE",
    121: "BENGAL INSTITUTE OF TECHNOLOGY TECH TOWN",
    122: "ST. THOMAS COLLEGE OF ENGINEERING & TECHNOLOGY",
    123: "JIS COLLEGE OF ENGINEERING BLOCK-A",
    124: "GUPTA COLLEGE OF TECHNOLOGICAL",
    125: "BENGAL COLLEGE OF ENGINEERING & TECHNOLOGY",
    126: "HERITAGE INSTITUTE OF TECHNOLOGY",
    127: "NARULA INSTITUTE OF TECHNOLOGY",
    129: "BHARTIYA VIDYA BHAVAN INSTITUTE",
    130: "TECHNO MAIN SALT LAKE",
    131: "DUMKAL INSTITUTE OF ENGINEERING",
    132: "BHOLANANDA NATIONAL ACADEMY VILLAGE: PANPUR",
    133: "GEORGE COLLEGE 136 B. B. GANGULY STREET",
    134: "GITARAM INSTITUTE OF MANAGEMENT BERHAMPORE",
    136: "ARMY INSTITUTE OF MANAGEMENT JUDGES COURT ROAD OPPOSITE",
    137: "INSTITUTE OF BUSINESS MANAGEMENT",
    139: "VIDYASAGAR COLLEGE OF OPTOMETRY & VISION SCIENCE",
    142: "MEGHNAD SAHA INSTITUTE OF TECHNOLOGY",
    143: "GURUNANAK INSTITUTE OF TECHNOLOGY",
    144: "NEOTIA INSTITUTE OF TECHNOLOGY",
    145: "TECHNO INDIA INSTITUTE OF TECHNOLOGY",
    148: "FUTURE INSTITUTE OF ENGINEERING",
    149: "NSHM COLLEGE OF MANAGEMENT & TECHNOLOGY",
    150: "NOPANY INSTITUTE OF MANAGEMENT",
    152: "TECHNO INDIA (HOOGHLY CAMPUS) DHARAMPUR SANTINIKATAN",
    153: "SYAMAPRASAD INST. OF TECH. & MANAGEMENT",
    154: "DINABANDHU ANDREWS INSTITUTE OF TECHNOLOGY & MANAGEMENT",
    155: "DURGAPUR INSTITUTE OF ADVANCED TECHNOLOGY & MANAGEMENT",
    156: "PAILAN COLLEGE OF MANAGEMENT & TECHNOLOGY [B.TECH DIVISION]",
    158: "MALLABHUM INSTITUTE OF TECHNOLOGY",
    159: "CALCUTTA INSTITUTE OF PHARMACEUTICAL TECHNOLOGY & ALLIED HEALTH SCIENCES",
    160: "NATIONAL INSTITUTE OF TECHNICAL TEACHERSâ€™ TRAINING & RESEARCH",
    161: "PARAMEDICAL COLLEGE",
    163: "BENGAL INSTITUTE OF TECHNOLOGY",
    164: "GEORGE COLLEGE OF MANAGEMENT AND SCIENCE",
    165: "CALCUTTA INSTITUTE OF ENGINEERING",
    168: "SAROJ MOHAN INSTITUTE OF TECHNOLOGY",
    169: "ACADEMY OF TECHNOLOGY G.T. ROAD",
    170: "IMPS COLLEGE OF ENGINEERING & TECHNOLOGY",
    173: "KINGSTON SCHOOL OF MANAGEMENT AND SCIENCE",
    174: "NETAJI SUBHAS CHANDRA BOSEINSTITUTE OF PHARMACY",
    175: "HALDIA INSTITUTE OF MANAGEMENT P.O. HATIBERIA",
    176: "HOOGHLY ENGINEERING & TECHNOLOGY COLLEGE",
    177: "CALCUTTA INSTITUTE OF TECHNOLOGY",
    178: "INTERNATIONAL INSTITUTE OF MANAGEMENT SCIENCES",
    179: "HALDIA INSTITUTE OF MARITIME",
    180: "NIPS SCHOOL OF HOTEL MANAGEMENT",
    182: "INSTITUTE OF SCIENCE AND TECHNOLOGY",
    183: "EASTERN INSTITUTE FOR INTEGRATED",
    185: "GURUNANAK INSTITUTE OF HOTEL MANAGEMENT",
    186: "GURU NANAK INSTITUTE OF PHARMACEUTICAL SCIENCE & TECHNOLOGY",
    187: "TECHNO INTERNATIONAL NEW TOWN MEGA CITY",
    188: "TECHNO COLLEGE HOOGHLY",
    189: "DR. B. C. ROY COLLEGE OF PHARMACY",
    192: "GLOBAL INSTITUTE OF SCIENCE & TECHNOLOGY",
    193: "BENGAL SCHOOL OF TECHNOLOGY SUGANDHA",
    194: "INSTITUTE OF MANAGEMENT STUDY 93 MUKUNDAPUR MAIN ROAD",
    195: "THE CALCUTTA ANGLO GUJARATI",
    198: "ADVANCED INFORMATION & MANAGEMENT STUDIES",
    199: "DOOARS ACADEMY OF TECHNOLOGY",
    200: "GOLDEN REGENCY INSTITUTE OF DEBHOG",
    201: "BCDA COLLEGE OF PHARMACY & TECHNOLOGY",
    202: "KOTIBARSHA INSTITUTE OF TECHNOLOGY AND MANAGEMENT",
    206: "SEACOM ENGINEERING COLLEGE JALADHULAGORI SANKRAIL",
    208: "BHARAT TECHNOLOGY JADURBERIA",
    209: "DREAM INSTITUTE OF TECHNOLOGY",
    210: "INSTITUTE OF GENETIC ENGINEERING THAKURHAT ROAD",
    211: "POST GRADUATE INSTITUTE OF HOSPITAL ADMINISTRATION",
    212: "TAMRALIPTA INSTITUTE OF MANAGEMENT & TECHNOLOGY",
    213: "THE HERITAGE ACADEMY CHOWBAGA ROAD",
    214: "SEACOM MANAGEMENT COLLEGE JALADHULAGORI",
    215: "NIMAS",
    216: "ABS ACADEMY OF SCIENCE TECHNOLOGY & MANAGEMENT",
    220: "PRAJNANANANDA INSTITUTE OF TECHNOLOGY & MANAGEMENT",
    221: "GURUKUL MANAGEMENT STUDIES MOUZA-NARAYANPUR",
    226: "TECHNO INDIA",
    229: "DURGAPUR INSTITUTE OF SCIENCE TECHNOLOGY AND MANAGEMENT",
    230: "CAMELLIA INSTITUTE OF TECHNOLOGY DIGBERIA",
    234: "NSHM COLLEGE OF MANAGEMENT & TECHNOLOGY",
    235: "SEACOM MARINE COLLEGE JALADHULAGORI",
    236: "GREATER KOLKATA COLLEGE OF ENGINEERING & MANAGEMENT",
    238: "CAMELLIA SCHOOL OF ENGINEERING",
    240: "ABACUS INSTITUTE OF ENGINEERING",
    241: "SWAMI VIVEKANANDA INSTITUTE OF SCIENCE & TECHNOLOGY",
    242: "BENGAL COLLEGE OF PHARMACEUTICAL SCIENCES & RESEARCH",
    243: "WEST BENGAL STATE COUNCIL FOR SCIENCE & TECHNOLOGY",
    244: "TECHNO ENGINEERING COLLEGE",
    246: "RINPOCHE ACADEMY OF MANAGEMENT AND TECHNOLOGY",
    250: "SWAMI VIVEKANANDA INSTITUTE OF MANAGEMENT & COMPUTER SCIENCE",
    252: "KANAD INSTITUTE OF ENGINEERING & MANAGEMENT",
    253: "SUPREME KNOWLEDGE FOUNDATION GROUP OF INSTITUTIONS",
    255: "DR. SUDHIR CHANDRA SUR INSTITUTE",
    257: "CAMELLIA INSTITUTE OF TECHNOLOGY & MANAGEMENT",
    259: "GLOBAL INSTITUTE OF MANAGEMENT AND TECHNOLOGY",
    260: "BENGAL COLLEGE OF ENGINEERING SHILPO KANAN ROAD",
    261: "SURENDRA INSTITUTE OF ENGINEERING & MANAGEMENT",
    263: "REGENT EDUCATION & RESEARCH",
    264: "SWAMI VIVEKANANDA INSTITUTE OF MODERN SCIENCE",
    265: "DOLPHIN SCHOOL OF HOTEL MANAGEMENT",
    266: "BENGAL SCHOOL OF TECHNOLOGY & MANAGEMENT",
    269: "MODERN INSTITUTE OF ENGINEERING",
    271: "CAMELLIA INSTITUTE OF ENGINEERING",
    273: "NSHM KNOWLEDGE CAMPUS",
    275: "OMDAYAL GROUP OF INSTITUTIONS",
    276: "BUDGE BUDGE INSTITUTE OF TECHNOLOGY",
    277: "NSHM KNOWLEDGE CAMPUS",
    278: "SANAKA EDUCATIONAL TRUST",
    279: "IDEAL INSTITUTE OF ENGINEERING KALYANI SHILPANCHAL",
    281: "GARGI MEMORIAL INSTITUTE OF TECHNOLOGY CAMPUS",
    286: "ST. MARY'S TECHNICAL CAMPUS",
    287: "ROCKVALE MANAGEMENT COLLEGE 9",
    288: "DARJEELING UNIVERSAL CAMPUS TAKDAH CANTONMENT",
    289: "ILEAD (INSTITUTE OF LEADERSHIP)",
    290: "INSTITUTE OF HOTEL AND RESTAURANT MANAGEMENT",
    291: "NETAJI SUBHASH ENGINEERING COLLEGE",
    292: "NETAJI SUBHASH ENGINEERING COLLEGE",
    294: "FUTURE INSTITUTE OF ENGINEERING",
    296: "PAILAN COLLEGE OF MANAGEMENT & TECHNOLOGY (MBA DIVISION)",
    297: "PAILAN COLLEGE OF MANAGEMENT & TECHNOLOGY",
    298: "INSTITUTE OF BUSINESS MANAGEMENT",
    299: "CALCUTTA INSTITUTE OF ENGG. AND MANAGEMENT",
    300: "MAKAUT WB",
    301: "B. P. PODDAR INSTITUTE OF MANAGEMENT & TECHNOLOGY",
    304: "HERITAGE BUSINESS SCHOOL",
    306: "NARULA INSTITUTE OF TECHNOLOGY",
    309: "TECHNO INDIA",
    310: "MEGHNAD SAHA INSTITUTE OF TECHNOLOGY",
    311: "GURUNANAK INSTITUTE OF TECHNOLOGY",
    312: "GURUNANAK INSTITUTE OF HOTEL MANAGEMENT",
    313: "GURUNANAK INSTITUTE OF PHARMACEUTICAL SCIENCE & TECHNOLOGY",
    314: "TECHNO INDIA COLLEGE OF MEGHA CITY",
    318: "JIS COLLEGE OF ENGINEERING BLOCK A",
    320: "SAROJ MOHAN INSTITUTE OF TECHNOLOGY",
    321: "INSTITUTE OF SCIENCE & TECHNOLOGY DHURABILA",
    322: "ASANSOL ENGINEERING COLLEGE KANYAPUR",
    323: "DR. B. C. ROY ENGINEERING COLLEGE ACADEMY OF PROFESSIONAL",
    324: "BENGAL COLLEGE OF ENGINEERING & TECHNOLOGY",
    326: "MANAGEMENT INSTITUTE OF DURGAPUR",
    327: "ARYABHATTA INSTITUTE OF ENGINEERING & MANAGEMENT",
    328: "ABS ACADEMY OF SCIENCE",
    329: "BENGAL INSTITUTE OF TECHNOLOGY & MANAGEMENT",
    330: "MURSHIDABAD COLLEGE OF ENGINEERING AND TECHNOLOGY",
    331: "DUMKAL INSTITUTE OF ENGINEERING",
    332: "TECHNO INTERNATIONAL BATANAGAR PUTKHALI",
    333: "IMS BUSINESS SCHOOL VILL-MAKRAMPUR",
    334: "SILIGURI INSTITUTE OF TECHNOLOGY HILL CART ROAD",
    335: "SILIGURI INSTITUTE OF TECHNOLOGY",
    336: "SILIGURI INSTITUTE OF TECHNOLOGY",
    337: "GLOBAL GROUP OF INSTITUTIONS SRIKRISHNAPUR",
    338: "IIAS SCHOOL OF MANAGEMENT",
    339: "BHARATIYA VIDYA BHAVAN INSTITUTE",
    340: "CONTAI COLLEGE OF LEARNING & MANAGEMENT SCIENCE",
    341: "SBIHM SCHOOL OF MANAGEMENT JAGANNATHPUR ROAD",
    342: "FUTURE INSTITUTE OF TECHNOLOGY",
    343: "HEMNALINI MEMORIAL COLLEGE OF ENGINEERING",
    344: "INSPIRIA KNOWLEDGE CAMPUS HIMACHAL VIHAR",
    345: "GLOBAL COLLEGE OF SCIENCE AND TECHNOLOGY",
    346: "ELITTE COLLEGE OF ENGINEERING KARNAMADHABPUR ",
    347: "JLD ENGINEERING AND MANAGEMENT",
    348: "EMINENT COLLEGE OF MANAGEMENT",
    349: "COOCH BEHAR GOVERNMENT ENGINEERING COLLEGE",
    350: "RAMKRISHNA MAHATO GOVERNMENT ENGINEERING COLLEGE PURULIA",
    351: "SWAMI VIVEKANANDA INSTITUTE OF MODERN STUDIES",
    352: "P. G. INSTITUTE OF MEDICAL SCIENCES DHURABILA",
    353: "BIRBHUM PHARMACY SCHOOL BANDHERSOLE",
    354: "EMINENT COLLEGE OF PHARMACEUTICAL TECHNOLOGY",
    355: "GHANI KHAN CHOUDHURY INSTITUTE",
    356: "GLOBAL COLLEGE OF PHARMACEUTICAL TECHNOLOGY",
    358: "SUBHAS BOSE INSTITUTE OF HOTEL MANAGEMENT",
    359: "SUSRUT EYE FOUNDATION & RESEARCH CENTRE",
    361: "WEBEL DQE ANIMATION ACADEMY WEBEL BHAVAN",
    362: "GITANJALI COLLEGE OF PHARMACY VILL+P.O.-LOHAPUR",
    363: "M.R. COLLEGE OF PHARMACEUTICAL",
    364: "SUPREME INSTITUTE OF MANAGEMENT",
    365: "ANAND COLLEGE OF EDUCATION VILL KABILPUR",
    366: "INSTITUTE OF ENGINEERING & MANAGEMENT",
    376: "BENGAL COLLEGE OF PHARMACEUTICAL TECHNOLOGY",
}
module.exports.collegeCodes = colleges;

const cources = {
    "052": "B.Tech Apparel & Production Management",
    "053": "B.Tech Applied Electronics & Instrumentation Engineering   ",
    "055": "B.Tech Applied Electronics & Instrumentation Engineering   ",
    "023": "Bachelor Architecture",
    "032": "B.Tech Automobile Engineering",
    "031": "B.Tech Biomedical Engineering",
    "004": "B.Tech Biotechnology",
    "006": "B.Tech Chemical Engineering",
    "054": "B.Tech Civil & Environmental Engineering",
    "013": "B.Tech Civil Engineering",
    "001": "B.Tech Computer Sc. & Engineering",
    "028": "B.Tech Electrical & Electronics Engineering",
    "016": "B.Tech Electrical Engineering",
    "003": "B.Tech Electronics & Communications Engg",
    "034": "B.Tech Food Technology",
    "022": "Bachelor Hotel Management & Catering Technology",
    "002": "B.Tech Information Technology",
    "040": "B.Tech Instrumentation & Control Engineering",
    "018": "B.Tech Leather Technology",
    "007": "B.Tech Mechanical Engineering",
    "019": "Bachelor of Pharmacy",
    "014": "B.Tech Textile Technology",
    "320": "B.Tech Robotics",
    "304": "B.Tech Data Science",
    "305": "B.Tech Computer Science and Engineering (Data Science)",
    "306": "B.Tech Artificial Intelligence and Machine Learning",
    "308": "B.Tech Computer Science And Engineering (AI & ML) ",
    "309": "B.Tech Computer Science And Engineering (IoT & Cyber Security including Block Chain Technology)",
    "310": "B.Tech Artificial Intelligence And Data Science",
    "311": "B.Tech Computer Science and Business System",
    "536": "Bachelor of Hospitality And Tourism Administration ",
    "315": "B.Tech Computer Science & Design (CSD)",
}
module.exports.courceCodes = cources;

const subCodes = ["BSCH101",
    "BSCH191",
    "BSM101",
    "BSPH101",
    "BSPH191",
    "ESEE101",
    "ESEE191",
    "ESME191",
    "ESME192",
    "BSCH201",
    "BSCH291",
    "BSM201",
    "BSPH201",
    "BSPH291",
    "ESCS201",
    "ESCS291",
    "ESME291",
    "ESME292",
    "HMHU201",
    "HMHU291",
    "BSC301",
    "CH301",
    "CS301",
    "CS302",
    "CS303",
    "CS391",
    "CS392",
    "CS393",
    "ES-CS391",
    "ESC301",
    "HSMC301",
    "HU301",
    "PCC-CS301",
    "PCC-CS302",
    "PCC-CS391",
    "PCC-CS392",
    "PCC-CS393",
    "PH301",
    "PH391",
    "BSC 401",
    "CS401",
    "CS402",
    "CS403",
    "CS491",
    "CS492",
    "CS493",
    "HU481",
    "M401",
    "MC401",
    "MCS401",
    "MCS491",
    "PCC-CS401",
    "PCC-CS402",
    "PCC-CS403",
    "PCC-CS404",
    "PCC-CS492",
    "PCC-CS494",
    "CS501",
    "CS502",
    "CS503",
    "CS504D",
    "CS591",
    "CS592",
    "CS593",
    "CS594D",
    "HU501",
    "CS601",
    "CS602",
    "CS603",
    "CS604B",
    "CS605A",
    "CS681",
    "CS691",
    "CS692",
    "CS693",
    "HU601"] 
module.exports.subjectCodes = subCodes;
module.exports.subjectCodeMap = {
    "BSCH101": ["SM01"],
    "BSCH191": ["SM01"],
    "BSM101": ["SM01"],
    "BSPH101": ["SM01"],
    "BSPH191": ["SM01"],
    "ESEE101": ["SM01"],
    "ESEE191": ["SM01"],
    "ESME191": ["SM01"],
    "ESME192": ["SM01"],
    "BSCH201": ["SM02"],
    "BSCH291": ["SM02"],
    "BSM201": ["SM02"],
    "BSPH201": ["SM02"],
    "BSPH291": ["SM02"],
    "ESCS201": ["SM02"],
    "ESCS291": ["SM02"],
    "ESME291": ["SM02"],
    "ESME292": ["SM02"],
    "HMHU201": ["SM02"],
    "HMHU291": ["SM02"],
    "BSC301": ["SM03"],
    "CH301": ["SM03"],
    "CS301": ["SM03"],
    "CS302": ["SM03"],
    "CS303": ["SM03"],
    "CS391": ["SM03"],
    "CS392": ["SM03"],
    "CS393": ["SM03"],
    "ES-CS391": ["SM03"],
    "ESC301": ["SM03"],
    "HSMC301": ["SM03"],
    "HU301": ["SM03"],
    "PCC-CS301": ["SM03"],
    "PCC-CS302": ["SM03"],
    "PCC-CS391": ["SM03"],
    "PCC-CS392": ["SM03"],
    "PCC-CS393": ["SM03"],
    "PH301": ["SM03"],
    "PH391": ["SM03"],
    "BSC 401": ["SM04"],
    "CS401": ["SM04"],
    "CS402": ["SM04"],
    "CS403": ["SM04"],
    "CS491": ["SM04"],
    "CS492": ["SM04"],
    "CS493": ["SM04"],
    "HU481": ["SM04"],
    "M401": ["SM04"],
    "MC401:": ["SM04"],
    "MCS401": ["SM04"],
    "MCS491": ["SM04"],
    "PCC-CS401": ["SM04"],
    "PCC-CS402": ["SM04"],
    "PCC-CS403": ["SM04"],
    "PCC-CS404": ["SM04"],
    "PCC-CS492": ["SM04"],
    "PCC-CS494": ["SM04"],
    "CS501": ["SM05"],
    "CS502": ["SM05"],
    "CS503": ["SM05"],
    "CS504D": ["SM05"],
    "CS591": ["SM05"],
    "CS592": ["SM05"],
    "CS593": ["SM05"],
    "CS594D": ["SM05"],
    "HU501": ["SM05"],
    "CS601": ["SM06"],
    "CS602": ["SM06"],
    "CS603": ["SM06"],
    "CS604B": ["SM06"],
    "CS605A": ["SM06"],
    "CS681": ["SM06"],
    "CS691": ["SM06"],
    "CS692": ["SM06"],
    "CS693": ["SM06"],
    "HU601": ["SM06"]
}