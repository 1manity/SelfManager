// routes/upload.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadImage } = require('../utils/avatar');
const ApiResponse = require('../utils/ApiResponse');
const path = require('path');

router.post('/avatar', authMiddleware, uploadImage.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(ApiResponse.error('未上传文件'));
        }
        const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
        res.json(ApiResponse.success('头像上传成功', { avatar: avatarUrl }));
    } catch (error) {
        res.status(400).json(ApiResponse.error(error.message));
    }
});

module.exports = router;
