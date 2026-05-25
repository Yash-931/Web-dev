// enum Direction {
//     Up,
//     Down,
//     Left,
//     right
// }

// function doSomething(keyPressed: Direction){
//     if(keyPressed == Direction.Down){
//         console.log("You pressed the down arrow key");
//     }
// }

// doSomething(Direction.Down);


function identity<T>(arg: T): T {
    return arg
}

identity<number>(2);
identity<string>("yash");