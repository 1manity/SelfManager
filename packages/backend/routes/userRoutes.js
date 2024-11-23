const express = require('express');
const UserService = require('../services/userService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // 加载 .env 文件中的环境变量

// 创建用户
router.post('/',authMiddleware, async (req, res) => {
    console.log("TEST" ,typeof req.body, req.body)
    const { username, password } = req.body;
    try {
        const user = await UserService.createUser(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// // 获取所有用户
// router.get('/',authMiddleware, async (req, res) => {
//     const users = await UserService.getAllUsers();
//     res.json(users);
// });
//
// // 获取单个用户
// router.get('/:id',authMiddleware, async (req, res) => {
//     const user = await UserService.getUserById(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
// });
//
// // 更新用户
// router.put('/:id',authMiddleware, async (req, res) => {
//     try {
//         const user = await UserService.updateUser(req.params.id, req.body);
//         res.json(user);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });
//
// // 删除用户
// router.delete('/:id',authMiddleware, async (req, res) => {
//     try {
//         await UserService.deleteUser(req.params.id);
//         res.status(204).send();
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// 用户登录验证
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await UserService.verifyUser(username, password);
    if (!user) return res.status(401).json({ code: 401, error: 'Invalid username or password' });
    // 使用环境变量来管理 JWT 的 secret key
    const secretKey = process.env.JWT_SECRET_KEY;
    console.log(user.id)
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.json({ code: 200, message: 'Login successful', data: { token } });
});

module.exports = router;
