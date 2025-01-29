'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Project extends Model {
        /**
         * 关联模型
         */
        static associate(models) {
            // 一个项目有多个版本
            Project.hasMany(models.Version, {
                foreignKey: 'projectId',
                as: 'versions',
                onDelete: 'CASCADE',
            });

            // 一个项目有多个用户（多对多关系）
            Project.belongsToMany(models.User, {
                through: models.ProjectUser, // 关联表
                foreignKey: 'projectId',
                otherKey: 'userId',
                as: 'users',
            });

            // 一个项目有一个创建者
            Project.belongsTo(models.User, {
                foreignKey: 'creatorId',
                as: 'creator',
                onDelete: 'SET NULL', // 如果创建者被删除，设置为 NULL
            });
        }
    }

    Project.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 100], // 项目名称长度限制
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            status: {
                type: DataTypes.ENUM('planning', 'in_progress', 'completed'),
                defaultValue: 'planning',
            },
            creatorId: {
                // 项目创建者
                type: DataTypes.INTEGER,
                allowNull: true, // 如果创建者被删除，可以为空
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
        },
        {
            sequelize,
            modelName: 'Project',
            tableName: 'Projects',
            timestamps: true,
            indexes: [
                {
                    unique: false,
                    fields: ['name'],
                    name: 'idx_projects_name',
                },
            ],
        }
    );

    return Project;
};
