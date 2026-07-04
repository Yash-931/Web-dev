let todoIndex = 1;

function addTodo() {
    let element = document.getElementById("todoInput");
    const todo = element.value;

    if(todo == "") return;
    element.value = "";

    const todoDiv = document.createElement("div");
    todoDiv.setAttribute("id", "todo" + todoIndex);
    const todoSpan = document.createElement("span");
    todoSpan.innerHTML = todo

    const todoButton = document.createElement("button");
    todoButton.innerHTML = "Delete todo";
    todoButton.setAttribute("onclick", "deleteTodo(" + todoIndex + ")");

    todoDiv.appendChild(todoSpan)
    todoDiv.appendChild(todoButton);

    const parentDiv = document.getElementById("todos");
    parentDiv.appendChild(todoDiv);
    todoIndex += 1;

}


function deleteTodo(index) {
    const divElement = document.getElementById("todo" + index);
    divElement.parentElement.removeChild(divElement);
}