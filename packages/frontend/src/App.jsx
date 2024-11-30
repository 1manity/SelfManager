

import './App.css'
import Home from "./pages/home/index.jsx";
import Login from "./pages/login/index.jsx";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/dashboard/index.jsx";
import Task from "./pages/task/index.jsx";
import Layout from "./components/layout/index.jsx";
function App() {
  return (
    <div className={"min-h-screen"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />

          {/* 使用 Layout 作为父路由，嵌套其他路由 */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="tasks" element={<PrivateRoute element={<Task />} />} />
        </Route>
      </Routes>
    </div>
  )
}

// 假设有一个函数可以检查用户是否已登录
const isAuthenticated = () => {
  // 这里可以根据实际情况来检查用户是否已登录
  return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default App
