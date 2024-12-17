const express = require('express');
const UserService = require('../services/userService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // 加载 .env 文件中的环境变量
const ApiResponse = require('../utils/ApiResponse'); // 引入 ApiResponse 类
const { uploadImage } = require('../utils/avatar');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');

// 创建用户
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.error(username, password);

        const user = await UserService.createUser(username, password);
        res.json(ApiResponse.success('用户创建成功', user));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 用户登录验证
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserService.verifyUser(username, password);
        if (!user) {
            return res.json(ApiResponse.error('用户名或密码无效'));
        }

        // 使用环境变量来管理 JWT 的 secret key
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, {
            expiresIn: '1h',
        });

        res.json(ApiResponse.success('登录成功', { user, token }));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取所有用户
router.get('/', authMiddleware, authAdminMiddleware, async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.json(ApiResponse.success('获取用户列表成功', users));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取自身用户数据
router.get('/whoami', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.json(ApiResponse.notFound('用户未找到'));
        }
        res.json(ApiResponse.success('获取用户成功', user));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取单个用户
router.get('/:id', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const user = await UserService.getUserById(id);
        if (!user) {
            return res.json(ApiResponse.notFound('用户未找到'));
        }
        res.json(ApiResponse.success('获取用户成功', user));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 更新用户
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    console.log(updates);
    try {
        const user = await UserService.updateUser(id, updates);
        if (!user) {
            return res.json(ApiResponse.notFound('用户未找到'));
        }
        res.json(ApiResponse.success('用户更新成功', user));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 删除用户
router.delete('/:id', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await UserService.deleteUser(id);
        res.json(ApiResponse.noContent('用户删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 上传用户头像
router.post('/:id/avatar', authMiddleware, uploadImage.single('avatar'), async (req, res) => {
    const { id } = req.params;
    const authenticatedUser = req.user;

    try {
        // 确保当前用户是自己或者是管理员
        if (authenticatedUser.id != id) {
            return res.json(ApiResponse.error('禁止上传其他用户的头像'));
        }

        if (!req.file) {
            return res.json(ApiResponse.error('未上传文件'));
        }

        // 构建头像URL
        const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

        // 更新用户的头像URL
        const user = await UserService.updateUser(id, { avatar: avatarUrl });

        if (!user) {
            return res.json(ApiResponse.notFound('用户未找到'));
        }

        res.json(ApiResponse.success('头像上传成功', { avatar: avatarUrl }));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
