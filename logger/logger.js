function noop() {}
const savedFunctions = Object.keys(console)
  .reduce((memo, key) => {
    if(typeof console[key] == "function") {
      //keep a copy just in case we need it
      memo[key] = console[key];
      //de-fang any functions 
      console[key] = noop;
    }
    
    return memo;
  }, 
  {});

module.exports.logger = savedFunctions;