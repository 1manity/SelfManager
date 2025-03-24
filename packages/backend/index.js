const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const initDatabase = require('./database/initDatabase');
const { setupSocketServer } = require('./socket');

const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/upload');
const projectRoutes = require('./routes/projectRoutes');
const versionRoutes = require('./routes/versionRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const defectRoutes = require('./routes/defectRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const projectFileRoutes = require('./routes/projectFileRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const ApiResponse = require('./utils/ApiResponse'); // 引入 ApiResponse 类

const app = express();
const server = http.createServer(app);

// 设置 Socket.io
const io = setupSocketServer(server);
// 导出 io 实例以便其他模块使用
exports.io = io;

// 配置静态文件中间件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体
app.use('/users', userRoutes); // 挂载用户路由
app.use('/upload', uploadRoutes);
// 项目路由
app.use('/projects', projectRoutes);
// 版本路由
app.use('/versions', versionRoutes);
// 需求路由
app.use('/requirements', requirementRoutes);
// 缺陷路由
app.use('/defects', defectRoutes);
// 注册路由
app.use('/dashboard', dashboardRoutes);
// 文件路由
app.use('/projects', projectFileRoutes);
app.use('/notifications', notificationRoutes);

// 全局错误处理（可选）
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(ApiResponse.error('服务器内部错误'));
});

const startServer = async () => {
    await initDatabase(); // 初始化数据库
    server.listen(33456, () => console.log('服务器运行在端口 33456'));
};

startServer();
