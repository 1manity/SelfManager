'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProjectUser extends Model {
        /**
         * 关联模型
         */
        static associate(models) {
            // 可以在这里定义额外的关联（如果有的话）
        }
    }

    ProjectUser.init(
        {
            projectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Projects',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            role: {
                type: DataTypes.ENUM('creator', 'manager', 'member'),
                allowNull: false,
                defaultValue: 'member',
            },
            // 加入时间
            joinedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'ProjectUser',
            tableName: 'ProjectUsers',
            timestamps: true, // 启用时间戳以跟踪变更
            indexes: [
                {
                    unique: true,
                    fields: ['projectId', 'userId'],
                    name: 'idx_projectUser_projectId_userId_unique',
                },
            ],
        }
    );

    return ProjectUser;
};
