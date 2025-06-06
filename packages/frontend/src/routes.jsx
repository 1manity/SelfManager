import Home from './pages/home/index.jsx';
import Login from './pages/login/index.jsx';
import Dashboard from './pages/dashboard/index.jsx';
import Setting from './pages/setting/index.jsx';
import Profile from './pages/setting/profile';
import Layout from './components/layout/index.jsx';
import Project from './pages/project/index.jsx';
import ProjectDetail from './pages/project/detail/index.jsx';
import VersionDetail from './pages/project/version/index.jsx';
import Users from './pages/admin/users/index.jsx';
import ProjectInfo from './pages/project/detail/tabs/ProjectInfo.jsx';
import ProjectVersions from './pages/project/detail/tabs/ProjectVersions.jsx';
import ProjectMembers from './pages/project/detail/tabs/ProjectMembers.jsx';
import ProjectFiles from './pages/project/detail/tabs/ProjectFiles.jsx';
import ProjectSettings from './pages/project/detail/tabs/ProjectSettings.jsx';
import VersionInfo from './pages/project/version/tabs/VersionInfo';
import RequirementTab from './pages/project/version/tabs/RequirementTab';
import DefectTab from './pages/project/version/tabs/DefectTab';
import MyTasksTab from './pages/project/version/tabs/MyTasksTab';
import VersionSettings from './pages/project/version/tabs/VersionSettings';

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
                <Route path="projects" element={<Project />} />
                <Route path="project/detail/:id" element={<ProjectDetail />}>
                    <Route path="" element={<Navigate to="info" />} />
                    <Route path="info" element={<ProjectInfo />} />
                    <Route path="versions" element={<ProjectVersions />} />
                    <Route path="members" element={<ProjectMembers />} />
                    <Route path="files" element={<ProjectFiles />} />
                    <Route path="settings" element={<ProjectSettings />} />
                </Route>
                <Route path="project/:projectId/version/:versionId" element={<VersionDetail />}>
                    <Route path="" element={<Navigate to="info" />} />
                    <Route path="info" element={<VersionInfo />} />
                    <Route path="requirements" element={<RequirementTab />} />
                    <Route path="defects" element={<DefectTab />} />
                    <Route path="my-tasks" element={<MyTasksTab />} />
                    <Route path="settings" element={<VersionSettings />} />
                </Route>
                <Route path="users" element={<Users />} />
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
