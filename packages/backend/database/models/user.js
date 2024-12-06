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
                validate: {
                    len: [3, 50], // 用户名长度限制
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING, // 存储头像的URL
                allowNull: true, // 头像可以为空
                validate: {
                    isUrl: true, // 验证是否为有效的URL
                },
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true, // 如果需要唯一的昵称
                validate: {
                    len: [2, 30], // 设置昵称长度限制
                },
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true,
                validate: {
                    len: [0, 100], // 设置简介长度限制
                },
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
            },
        }
    );
    // 关联任务：一个用户有多个任务
    User.associate = function (models) {
        User.hasMany(models.Task, {
            foreignKey: 'userId',
            as: 'tasks', // 可以通过 `tasks` 访问该用户的所有任务
        });
        User.hasMany(models.TaskRule, {
            foreignKey: 'userId',
            as: 'taskRules', // 可以通过 `taskRules` 访问该用户的所有任务规则
            onDelete: 'CASCADE',
        });
    };
    return User;
};
