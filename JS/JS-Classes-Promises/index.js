// class Shape {
//     constructor(color){
//         this.color = color;
//     }

//     paint(){
//         console.log(`Paiting with color: ${this.color}`);
//     }
// }

// class Rectangle extends Shape{
//     constructor(width, height, color){
//         super(color)
//         this.width = width;
//         this.height = height;
//     }

//     area(width, height){
//         return this.width * this.height;
//     }

//     static whoamI(){
//         return "I am a rectangle"
//     }
// }

// class Square extends Shape{
//     constructor(side , color){
//         super(color)
//         this.side = side;
//     }

//     area() {
//         return this.side * this.side;
//     }
// }

// class Circle extends Shape{
//     constructor(radius , color){
//         super(color)
//         this.radius = radius;
//     }

//     area(radius){
//         return (2.17 * radius * radius);
//     }
// }

// // const rect1 = new Rectangle(10, 10, "red");
// // console.log(rect1);
// // rect1.paint();

// // console.log(Rectangle.whoamI());
// // console.log(rect1.area());

// const rect1 = new Rectangle(10, 10, "red");
// rect1.paint();



function fsReadFilePromisified(filePath, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        })
    })
}


function callback(data) {
    console.log(data);
}

function callbackerr(err){
    console.log(`Error reading the file ${err}`);
}

fsReadFilePromisified('test.txt', "UTF-8")
    .then(callback)
    .catch(callbackerr)