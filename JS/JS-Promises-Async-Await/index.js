// const fs = require("fs")

// function fsReadFilePromise(fileName, encoding) {
//     return new Promise(function (resolve, reject) {
//         fs.readFile(fileName, encoding, function(err, data) {
//             if(err){
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         })
//     });
// }


// fsReadFilePromise("b.txt", "utf-8")
//     .then(function(data) {
//         console.log(data);
//     })
//     .catch(function(err) {
//         console.log("Error while reading the file");
//     })



// function setTimeoutPromisified(delay) {
//     return new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             resolve()
//         }, delay)
//     })
// }


// setTimeoutPromisified(1000)
//     .then(function() {
//         console.log("Printed after 1 sec");
//     })



const fs = require("fs");


function fsReadFilePromisified(filePath, encoding){
    return new Promise( (resolve, reject) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if(err){
                reject(err);
            } else {
                resolve(data)
            }
        })
    })
}


function cleanFilePromisified(filePath){
    return new Promise( (resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if(err){
                reject(err);
            } else{
                let newData = data.trim();
                fs.writeFile(filePath, newData, (err) => {
                    if(err){
                        reject(err);
                    } else{
                        resolve();
                    }
                });
            }
        })
    })
}


// function cleanManyFiles(prefix){
//     return new Promise( (resolve, reject) => {
//         cleanFilePromisified(prefix + "1.txt")
//             .then( () =>{
//                 cleanFilePromisified(prefix + "2.txt")
//                     .then( () => {
//                         cleanFilePromisified(prefix + "3.txt")
//                             .then( () => { 
//                                 resolve();
//                             })
//                             .catch( () => {
//                                 reject();
//                             })
//                     })
//                     .catch( () => {
//                         reject();
//                     })
//             })
//             .catch( () => {
//                 reject();
//             })
//     })
// }

// fs.readFile("a.txt", "utf-8", (err, data) => {
//     console.log(data);
// })


// fsReadFilePromisified("a1.txt", "utf-8")
//     .then( (data) => {
//         console.log("File read success: " + data);
//     })
//     .catch( (err) => {
//         console.log("File read failed: " + err);
//     })

// for(let i = 0 ; i<10 ; i++){
//     console.log(i);
// }


// cleanFilePromisified("a1.txt")
//     .then( () => {
//         console.log("Cleaning success");
//     })
//     .catch( (err) => {
//         console.log("Error cleaning the file: " + err);
//     })

// for(let i = 0 ; i<10 ; i++){
//     console.log(i);
// }



// async function main() {
//     try{
//         await cleanFilePromisified("a1.txt")
//         console.log("File cleaning success");
//     } catch(e){
//         console.log("Erro: " + e);
//     }
// }


// function cleanManyFiles(prefix){
//     return new Promise(async function (resolve, reject) {
//         try {
//             await cleanFilePromisified(prefix + "1.txt");
//             await cleanFilePromisified(prefix + "2.txt");
//             await cleanFilePromisified(prefix + "3.txt");
//             resolve();
//         } catch(e){
//             reject();
//         }
//     })
// }


async function cleanManyFiles(prefix) {
    await cleanFilePromisified(prefix + "1.txt");
    await cleanFilePromisified(prefix + "2.txt");
    await cleanFilePromisified(prefix + "3.txt");
}

let p = cleanManyFiles("a")
    .then( () => {
        console.log("Cleaning done");
    })
    .catch( () => {
        console.log("Error cleaning the file");
    })

console.log(p);

