const express = require('express');
const cors = require('cors')
const initDatabase = require('./database/initDatabase')
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors())
app.use(express.json()); // 解析 JSON 请求体
app.use('/users', userRoutes); // 挂载用户路由
app.use('/tasks', taskRoutes); // 挂载用户路由

const startServer = async () => {
    await initDatabase(); // 初始化数据库
    app.listen(33456, () => console.log('Backend is running on port 33456'));
};

startServer();
// {
//     "code": <number>,
//     "message": <string>,
//     "data": <object | array>,
// }
