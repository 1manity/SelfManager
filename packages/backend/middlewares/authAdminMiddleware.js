const ApiResponse = require('../utils/ApiResponse');

const authAdminMiddleware = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            throw Error();
        }
    } catch (e) {
        return res.json(ApiResponse.error('管理员验证失败'));
    }
};

module.exports = authAdminMiddleware;
