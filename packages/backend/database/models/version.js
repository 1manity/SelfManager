'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Version extends Model {
        /**
         * 关联模型
         */
        static associate(models) {
            // 版本属于一个项目
            Version.belongsTo(models.Project, {
                foreignKey: 'projectId',
                as: 'project',
            });

            // 版本有多个需求
            Version.hasMany(models.Requirement, {
                foreignKey: 'versionId',
                as: 'requirements',
            });

            // 版本有多个缺陷
            Version.hasMany(models.Defect, {
                foreignKey: 'versionId',
                as: 'defects',
            });
        }
    }

    Version.init(
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
            versionNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 20], // 版本号长度限制
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            releaseDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('planned', 'development', 'released', 'closed'),
                defaultValue: 'planned',
            },
        },
        {
            sequelize,
            modelName: 'Version',
            tableName: 'Versions',
            timestamps: true,
            indexes: [
                {
                    unique: false,
                    fields: ['versionNumber', 'projectId'],
                    name: 'idx_versions_versionNumber_projectId',
                },
            ],
        }
    );

    return Version;
};
