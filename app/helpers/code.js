module.exports = ()=>{
  const randomNumbers = [];
    while(randomNumbers.length < 4){
      num = Math.floor(Math.random() * 10);

      //unique random numbers
      if(randomNumbers.indexOf(num) == -1){
        randomNumbers.push(num);
      }
    }
    return `EMP${randomNumbers.join('')}`;
}