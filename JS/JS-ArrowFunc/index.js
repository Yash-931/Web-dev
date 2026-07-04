// function sum(a, b) {
//     return a + b;
// }

// const sum = (a, b) => {
//     return a + b;
// }

const input = [1,2,3,4,5];

const transform = (i) => {
    return i*2;
}

const ans = input.map(transform);

console.log(ans);

const ans2= input.filter( (n) => {
    return (n % 2 == 0);
});

console.log(ans2);
