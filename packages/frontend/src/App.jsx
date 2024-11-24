

import './App.css'
import Home from "./pages/home/index.jsx";
import Login from "./pages/login/index.jsx";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/dashboard/index.jsx";

function App() {
  return (
    <div className={"min-h-screen"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
