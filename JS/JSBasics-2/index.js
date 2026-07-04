const fs = require("fs")

function fileReadCallback(err, contents){
    console.log(contents);
}

const contents = fs.readFile("a.txt", "utf-8", fileReadCallback);   //we are calling it sync --> JS thread will be stuck here until the OS doesn't return the contents
let s = 0;
for (let i = 0 ; i<100 ; i++){
    s += i;
}

console.log(s);


// function sum(a, b){
//     return a + b;
// }

// function sub(a, b){
//     return a - b;
// }

// function doAirthematic(a, b, fn){
//     return fn(a, b);
// }

// console.log(doAirthematic(2, 3, sum));
// console.log(doAirthematic(2, 3, sub));