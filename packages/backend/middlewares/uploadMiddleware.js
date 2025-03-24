const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 使用时间戳和原始文件名生成唯一文件名
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 这里可以添加文件类型限制
    // 例如，只允许上传特定类型的文件
    cb(null, true);
};

// 创建 multer 实例
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 限制文件大小为 50MB
    },
});

module.exports = {
    uploadFile: upload.single('file'), // 单文件上传
    uploadFiles: upload.array('files', 10), // 多文件上传，最多10个
};
