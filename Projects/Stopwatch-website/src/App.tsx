import { useRef, useState } from "react";
import "./App.css";

function App() {

  const [secondsPassed, setSecondsPassed] = useState(0)
  const interval = useRef(0)

  function startClock() {
    interval.current = setInterval( () => {
      setSecondsPassed(s => s + 1)
    }, 1000)

  }

  function stopClock() {
    clearInterval(interval.current)
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div style={{ fontSize: 100 }}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <button onClick={startClock}>Start Clock</button>
          <button onClick={stopClock}>Stop Clock</button>
        </div>
        {secondsPassed}s
      </div>
    </div>
  );
}

export default App;
