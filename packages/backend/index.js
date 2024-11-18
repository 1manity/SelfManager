const express = require('express');

const initDatabase = require('./database/initDatabase')
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json()); // 解析 JSON 请求体
app.use('/users', userRoutes); // 挂载用户路由

const startServer = async () => {
    await initDatabase(); // 初始化数据库
    app.listen(33456, () => console.log('Backend is running on port 33456'));
};

startServer();
