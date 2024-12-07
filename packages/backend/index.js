const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const initDatabase = require('./database/initDatabase');

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskRuleRoutes = require('./routes/taskRuleRoutes');
const uploadRoutes = require('./routes/upload');

const ApiResponse = require('./utils/ApiResponse'); // 引入 ApiResponse 类

const TaskRuleService = require('./services/taskRuleService'); // 引入 TaskRuleService

const app = express();

// 配置静态文件中间件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体
app.use('/users', userRoutes); // 挂载用户路由
app.use('/tasks', taskRoutes); // 挂载用户路由
app.use('/task-rules', taskRuleRoutes); // 挂载用户路由
app.use('/upload', uploadRoutes);

// 定时任务，每分钟检查一次
cron.schedule('* * * * *', async () => {
    console.log('检查并处理规则任务');
    try {
        await TaskRuleService.processRecurringTasks();
    } catch (error) {
        console.error('处理规则任务时出错:', error);
    }
});

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
// {
//     "code": <number>,
//     "message": <string>,
//     "data": <object | array>,
// }
