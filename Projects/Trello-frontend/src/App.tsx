import { Dashboard } from "./screens/Dashboard";
import { Board } from "./screens/Board";
import { Auth } from "./screens/Auth";
import "./App.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board/:boardId" element={<Board />} />
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </div>
  );
}

export default App;
