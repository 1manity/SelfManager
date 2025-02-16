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
                through: {
                    model: models.ProjectUser,
                    unique: false,
                },
                foreignKey: 'projectId',
                otherKey: 'userId',
                as: 'members',
            });

            // 获取项目管理者的关联
            Project.belongsToMany(models.User, {
                through: {
                    model: models.ProjectUser,
                    scope: {
                        role: 'manager',
                    },
                },
                foreignKey: 'projectId',
                otherKey: 'userId',
                as: 'managers',
            });

            // 创建者关联
            Project.belongsTo(models.User, {
                foreignKey: 'creatorId',
                as: 'creator',
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
                type: DataTypes.INTEGER,
                allowNull: false, // 改为不允许为空，项目必须有创建者
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE', // 如果创建者被删除，项目也会被删除
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
