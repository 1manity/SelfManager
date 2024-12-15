import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/user'; // 确保路径正确

import './App.css';
import AppRoutes from './routes';
import { whoami } from './api/user';

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const res = await whoami();
                if (res.code === 200) {
                    dispatch(setUser(res.data)); // 假设 res.data 包含用户信息
                } else {
                    throw new Error(res.message);
                }
            } catch (error) {
                console.error('初始化用户信息失败:', error);
            }
        };

        if (user.id === null) {
            // 仅在用户未初始化时调用
            initializeUser();
        }
    }, [dispatch, user]);

    return (
        <div className={'min-h-screen'}>
            <AppRoutes></AppRoutes>
        </div>
    );
}

export default App;
