'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProjectFile extends Model {
        static associate(models) {
            // 文件属于一个项目
            ProjectFile.belongsTo(models.Project, {
                foreignKey: 'projectId',
                as: 'project',
                onDelete: 'CASCADE',
            });

            // 文件有一个上传者
            ProjectFile.belongsTo(models.User, {
                foreignKey: 'uploaderId',
                as: 'uploader',
            });
        }
    }

    ProjectFile.init(
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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 255],
                },
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            size: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            uploaderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'ProjectFile',
            tableName: 'ProjectFiles',
            timestamps: true,
            indexes: [
                {
                    fields: ['projectId', 'name'],
                    unique: true,
                    name: 'idx_project_files_unique_name',
                },
            ],
        }
    );

    return ProjectFile;
};
