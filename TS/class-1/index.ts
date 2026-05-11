function greet(firstName: String) {
    console.log("Hello " + firstName);
}

greet("Yash");


function first_element(arr: number[]){
    if(arr.length > 0){
        return arr[0] ?? null;
    } else{
        return null;
    }
}

let x = first_element([])
let y = first_element([1, 2, 3])

console.log(x);
console.log(y);