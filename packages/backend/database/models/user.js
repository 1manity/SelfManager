'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        async checkPassword(password) {
            return bcrypt.compare(password, this.password); // 比较输入的密码和存储的哈希值
        }
    }

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false, // 禁止为 NULL
                unique: true, // 唯一字段
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'Users', // 数据库中的表名
            timestamps: true, // 默认添加 `createdAt` 和 `updatedAt`
            hooks: {
                // Sequelize 钩子：在保存数据前对密码进行加密
                beforeCreate: async (user) => {
                    user.password = await bcrypt.hash(user.password, 10);
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                },
            }
        }
    );

    return User;
};
