import Home from './pages/home/index.jsx';
import Login from './pages/login/index.jsx';
import Dashboard from './pages/dashboard/index.jsx';
import Task from './pages/task/index.jsx';
import Setting from './pages/setting/index.jsx';
import Profile from './pages/setting/profile';
import Layout from './components/layout/index.jsx';

import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />

            {/* 使用 Layout 作为父路由，嵌套其他路由 */}
            <Route path="/" element={<PrivateRoute element={<Layout />} />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tasks" element={<Task />} />
                <Route path="setting" element={<Setting />}>
                    <Route path="" element={<Profile />}></Route>
                    <Route path="preference" element={<div>preference</div>}></Route>
                    <Route path="data" element={<div>data</div>}></Route>
                </Route>
            </Route>
        </Routes>
    );
}

// 假设有一个函数可以检查用户是否已登录
const isAuthenticated = () => {
    // 这里可以根据实际情况来检查用户是否已登录
    return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ element, ...rest }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default AppRoutes;
