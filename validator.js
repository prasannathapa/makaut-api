module.exports.isRoll = (num)=>{
    return /^\d+$/.test(num)
}
module.exports.isSem = (num)=>{
    return /^([1-8]*|0)$/.test(num);
}
module.exports.isSemSingle = (num)=>{
    return /^([1-8])$/.test(num);
}
const sems = ['SM01', 'SM02', 'SM03', 'SM04', 'SM05', 'SM06', 'SM07', 'SM08'];
module.exports.getSem = sem =>{
    if(sem == '0')
        return sems.slice();
    let semList = [];
    for(let i = 0; i < sem.length; i++){
        let ai = parseInt(sem[i])
        semList.push(sems[ai-1]);
    }
    return semList;
}