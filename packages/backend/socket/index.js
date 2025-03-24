const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// 存储用户连接
const userSockets = new Map();

const setupSocketServer = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*', // 在生产环境中应该限制为特定域名
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // 中间件：验证用户身份
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('未提供认证令牌'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error('无效的认证令牌'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user.id;
        console.log(`用户 ${userId} 已连接`);

        // 将用户ID与socket关联
        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);

        // 加入个人房间
        socket.join(`user:${userId}`);

        // 断开连接时清理
        socket.on('disconnect', () => {
            console.log(`用户 ${userId} 已断开连接`);
            const userSocketSet = userSockets.get(userId);
            if (userSocketSet) {
                userSocketSet.delete(socket.id);
                if (userSocketSet.size === 0) {
                    userSockets.delete(userId);
                }
            }
        });
    });

    return io;
};

// 发送通知给特定用户
const sendNotificationToUser = (io, userId, notification) => {
    console.log('发送通知给特定用户', userId, notification);
    io.to(`user:${userId}`).emit('notification', notification);
};

module.exports = {
    setupSocketServer,
    sendNotificationToUser,
}; 