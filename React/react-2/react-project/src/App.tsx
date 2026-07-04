import { useEffect, useState } from "react";
import { APITester } from "./APITester";
import "./index.css";
import axios from "axios";

export function App() {
  let [data, setData] = useState([]);

  useEffect(function() {
    console.log("Called the backend to get the todo")
    axios.get('https://dummyjson.com/todos')
        .then(response => setData(response.data.todos))
  }, []);
  
  return (
    <div className="app">
      {/* {JSON.stringify(data)} */}
      {data.map(todo => <Todo title={todo.todo} />)}
    </div>
    )
  
}


function Todo(props){
  return <div style={{backgroundColor: "grey", margin:10, padding: 20, border: "1px solid black"}}>
    <div>{props.title}</div>
  </div>
}

export default App;
