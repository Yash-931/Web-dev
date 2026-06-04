 import './App.css'

function App() {

  let posts  = [
    {
      "name": "yash",
      "content": "Learning react 1"
    },
    {
      "name": "yash2",
      "content": "Learning react 1"
    },
    {
      "name": "yash3",
      "content": "Learning react 1"
    },
    {
      "name": "yash3",
      "content": "Learning react 1"
    },
  ]

  return (
    <div>
      LINKEDIN!!!
      {posts.map(p => <Post name={p.name} content={p.content} />)}
    </div>
  )
}

function Post(props) {
  return (
    <div style={{margin: 20, borderRadius: 20, padding: 20, border: "2px solid black"}}>
      <div>
        <b>{props.name}</b>
      </div>

      <div>
        {props.content}
      </div>
    </div>
  )
}

export default App
