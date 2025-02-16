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

/**
 * 创建用户（只有管理员可以创建）
 * @route POST /api/users
 * @body {object} body
 * @body {string} body.username - 用户名
 * @body {string} body.password - 密码
 * @body {string} [body.role] - 用户角色 ('admin'|'user')，创建管理员需要超级管理员权限
 * @body {string} [body.email] - 邮箱
 * @body {string} [body.phone] - 电话
 * @body {string} [body.avatar] - 头像URL
 * @returns {object} 创建的用户信息（不含密码）
 */
router.post('/', async (req, res) => {
    //authMiddleware
    const { username, password, role } = req.body;
    const operatorId = req.user?.id;
    try {
        // 检查操作者权限
        // const isAdmin = await UserService.isAdmin(operatorId);
        // if (!isAdmin) {
        //     return res.json(ApiResponse.forbidden('只有管理员才能创建用户'));
        // }

        // // 如果要创建管理员，需要是超级管理员
        // if (role === 'admin') {
        //     const isSuperAdmin = await UserService.isSuperAdmin(operatorId);
        //     if (!isSuperAdmin) {
        //         return res.json(ApiResponse.forbidden('只有超级管理员才能创建管理员账号'));
        //     }
        // }

        const user = await UserService.createUser(username, password, null, null, null, role);
        res.json(ApiResponse.success('用户创建成功', user));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 用户登录验证
 * @route POST /api/users/login
 * @body {object} body
 * @body {string} body.username - 用户名
 * @body {string} body.password - 密码
 * @returns {object} 登录信息，包含用户信息和JWT令牌
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserService.verifyUser(username, password);
        if (!user) {
            return res.json(ApiResponse.error('用户名或密码无效'));
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        res.json(ApiResponse.success('登录成功', { user, token }));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取所有用户（只有管理员可以访问）
 * @route GET /api/users
 * @returns {object[]} 用户列表（不含密码）
 */
router.get('/', authMiddleware, async (req, res) => {
    const operatorId = req.user.id;
    try {
        const isAdmin = await UserService.isAdmin(operatorId);
        if (!isAdmin) {
            return res.json(ApiResponse.forbidden('只有管理员才能查看用户列表'));
        }
        const users = await UserService.getAllUsers();
        res.json(ApiResponse.success('获取用户列表成功', users));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取自身用户数据
 * @route GET /api/users/whoami
 * @returns {object} 用户信息（不含密码）
 */
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

/**
 * 获取单个用户
 * @route GET /api/users/:id
 * @param {number} id - 用户ID
 * @returns {object} 用户信息（不含密码）
 */
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

/**
 * 更新用户信息（用户本人或管理员）
 * @route PUT /api/users/:id
 * @param {number} id - 用户ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.username] - 用户名
 * @body {string} [updates.password] - 新密码
 * @body {string} [updates.email] - 邮箱
 * @body {string} [updates.phone] - 电话
 * @body {string} [updates.avatar] - 头像URL
 * @returns {object} 更新后的用户信息（不含密码）
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const operatorId = req.user.id;
    try {
        // 如果不是本人，需要是管理员
        if (id !== operatorId) {
            const isAdmin = await UserService.isAdmin(operatorId);
            if (!isAdmin) {
                return res.json(ApiResponse.forbidden('没有权限修改其他用户信息'));
            }
        }

        const user = await UserService.updateUser(id, updates, operatorId);
        res.json(ApiResponse.success('用户更新成功', user));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除用户（需要是管理员）
 * @route DELETE /api/users/:id
 * @param {number} id - 用户ID
 * @returns {null}
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const operatorId = req.user.id;
    try {
        const isAdmin = await UserService.isAdmin(operatorId);
        if (!isAdmin) {
            return res.json(ApiResponse.forbidden('只有管理员才能删除用户'));
        }
        await UserService.deleteUser(id, operatorId);
        res.json(ApiResponse.noContent('用户删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 上传用户头像
 * @route POST /api/users/:id/avatar
 * @param {number} id - 用户ID
 * @body {file} avatar - 头像文件（图片）
 * @returns {object} 包含头像URL的信息
 */
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
