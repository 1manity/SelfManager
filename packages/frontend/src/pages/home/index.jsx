import React from 'react';
import HomeButton from './components/HomeButton';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const login = () => {
        navigate('/login'); // 跳转到 /login
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <HomeButton onClick={login}>登录</HomeButton>
        </div>
    );
}
