// utils/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 设置存储引擎
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
});

// 文件过滤器，确保只上传图片
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
        return cb(null, true);
    }
    cb(new Error('仅允许上传图片文件 (jpeg, jpg, png, gif)'));
};

// 配置 multer
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为5MB
    fileFilter: fileFilter,
});
const getDefaultAvatarUrl = (name, size = 100) => {
    if (!name) {
        // 返回一个通用的默认头像 URL
        return `https://ui-avatars.com/api/?name=User&size=${size}&background=random&rounded=true`;
    }
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random&rounded=true`;
};

module.exports = { getDefaultAvatarUrl, uploadImage };
