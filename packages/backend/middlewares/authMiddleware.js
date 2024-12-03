const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // 加载.env文件中的环境变量


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log("DEBUG :: authMiddleware" + authHeader)
    // 检查是否有 Authorization 头
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // 提取令牌
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
        // 验证令牌
        const decoded = jwt.verify(token, secretKey); // 替换为你的 JWT 密钥
        req.user = decoded; // 将解码后的用户信息挂载到请求对象上
        next(); // 继续执行下一个中间件
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
