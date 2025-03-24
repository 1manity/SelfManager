import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (socket) return socket;

    const token = localStorage.getItem('token');
    if (!token) return null;

    socket = io('http://localhost:33456', {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
        console.log('Socket连接成功');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket连接失败:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket断开连接:', reason);
    });
    console.log('initSocket', socket);
    return socket;
};

export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
