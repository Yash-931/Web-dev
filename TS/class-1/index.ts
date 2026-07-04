// function greet(firstName: String) {
//     console.log("Hello " + firstName);
// }

// greet("Yash");


// function first_element(arr: number[]){
//     if(arr.length > 0){
//         return arr[0] ?? null;
//     } else{
//         return null;
//     }
// }

// let x = first_element([])
// let y = first_element([1, 2, 3])

// console.log(x);
// console.log(y);


// <---------------------------------------------------------------->
// <---------------------------------------------------------------->

import express from 'express';

const app = express();

interface SignupInput {
    username: String,
    password: String
}

app.post("/signup", (req, res) => {
    const body: SignupInput = req.body;

    //logic --> push to DB

    res.json({
        message: "Signup Success "
    })
})

app.listen(3000);