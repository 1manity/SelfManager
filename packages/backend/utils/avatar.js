// utils/avatar.js
const getDefaultAvatarUrl = (name, size = 100) => {
    if (!name) {
        // 返回一个通用的默认头像 URL
        return `https://ui-avatars.com/api/?name=User&size=${size}&background=random&rounded=true`;
    }
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random&rounded=true`;
};

module.exports = { getDefaultAvatarUrl };
