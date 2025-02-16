'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { getDefaultAvatarUrl } = require('../../utils/avatar.js'); // 导入工具函数

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
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: true,
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
            role: {
                type: DataTypes.ENUM('super_admin', 'admin', 'user'),
                defaultValue: 'user', // 默认角色为普通用户
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
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                    // 处理默认头像
                    if (!user.avatar || user.avatar.trim() === '') {
                        const nameForAvatar = user.nickname || user.username;
                        user.avatar = getDefaultAvatarUrl(nameForAvatar, 100);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                    // 处理默认头像
                    if (user.changed('avatar') && (!user.avatar || user.avatar.trim() === '')) {
                        const nameForAvatar = user.nickname || user.username;
                        user.avatar = getDefaultAvatarUrl(nameForAvatar, 100);
                        console.log(user.avatar);
                    }
                },
            },
            indexes: [
                // 明确管理索引，避免自动创建过多索引
                {
                    unique: true,
                    fields: ['username'],
                    name: 'idx_users_username_unique',
                },
                // 如果有其他需要的索引，可以在这里添加
            ],
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
        // 一个用户有多个项目（作为参与者）
        User.belongsToMany(models.Project, {
            through: {
                model: models.ProjectUser,
                unique: false,
            },
            foreignKey: 'userId',
            otherKey: 'projectId',
            as: 'joinedProjects',
        });
        // 获取用户管理的项目
        User.belongsToMany(models.Project, {
            through: {
                model: models.ProjectUser,
                scope: {
                    role: 'manager',
                },
            },
            foreignKey: 'userId',
            otherKey: 'projectId',
            as: 'managedProjects',
        });
        // 获取用户创建的项目
        User.hasMany(models.Project, {
            foreignKey: 'creatorId',
            as: 'createdProjects',
        });
    };
    return User;
};
