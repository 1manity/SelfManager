const express = require('express');
const UserService = require('../services/userService');
const router = express.Router();

// 创建用户
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserService.createUser(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 获取所有用户
router.get('/', async (req, res) => {
    const users = await UserService.getAllUsers();
    res.json(users);
});

// 获取单个用户
router.get('/:id', async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// 更新用户
router.put('/:id', async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 删除用户
router.delete('/:id', async (req, res) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 用户登录验证
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await UserService.verifyUser(username, password);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });
    res.json({ message: 'Login successful', user });
});

module.exports = router;
