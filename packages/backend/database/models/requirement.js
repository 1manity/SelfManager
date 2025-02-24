'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Requirement extends Model {
        /**
         * 关联模型
         */
        static associate(models) {
            // 一个需求属于一个版本
            Requirement.belongsTo(models.Version, {
                foreignKey: 'versionId',
                as: 'version',
                onDelete: 'CASCADE',
            });

            // 需求关联到负责人
            Requirement.belongsTo(models.User, {
                foreignKey: 'assigneeId',
                as: 'assignee',
            });

            // 需求有多个评论
            Requirement.hasMany(models.Comment, {
                foreignKey: 'targetId',
                constraints: false,
                scope: {
                    targetType: 'requirement',
                },
                as: 'comments',
            });

            // 通过版本间接关联项目
            // 如果需要访问项目，可以通过 Requirement 实例的 version 关联
        }
    }

    Requirement.init(
        {
            versionId: {
                type: DataTypes.INTEGER,
                allowNull: false, // 需求必须关联到一个版本
                references: {
                    model: 'Versions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 100], // 需求标题长度限制
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            priority: {
                type: DataTypes.ENUM('high', 'medium', 'low'),
                defaultValue: 'medium',
            },
            status: {
                type: DataTypes.ENUM('pending', 'in_progress', 'developed', 'testing', 'completed'),
                defaultValue: 'pending',
            },
            dueDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            assigneeId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            assignedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            progress: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100,
                },
            },
            startedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Requirement',
            tableName: 'Requirements',
            timestamps: true,
            indexes: [
                {
                    unique: false,
                    fields: ['title'],
                    name: 'idx_requirements_title',
                },
            ],
        }
    );

    return Requirement;
};
