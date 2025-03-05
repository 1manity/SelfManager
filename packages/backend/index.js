const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const initDatabase = require('./database/initDatabase');

const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/upload');
const projectRoutes = require('./routes/projectRoutes');
const versionRoutes = require('./routes/versionRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const defectRoutes = require('./routes/defectRoutes');

const ApiResponse = require('./utils/ApiResponse'); // 引入 ApiResponse 类

const app = express();

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


// 全局错误处理（可选）
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(ApiResponse.error('服务器内部错误'));
});

const startServer = async () => {
    await initDatabase(); // 初始化数据库
    app.listen(33456, () => console.log('Backend is running on port 33456'));
};

startServer();
