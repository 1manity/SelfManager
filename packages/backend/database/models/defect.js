'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Defect extends Model {
        /**
         * 关联模型
         */
        static associate(models) {
            // 一个缺陷属于一个版本
            Defect.belongsTo(models.Version, {
                foreignKey: 'versionId',
                as: 'version',
                onDelete: 'CASCADE',
            });

            // 通过版本间接关联项目
            // 如果需要访问项目，可以通过 Defect 实例的 version 关联
        }
    }

    Defect.init(
        {
            versionId: {
                type: DataTypes.INTEGER,
                allowNull: false, // 缺陷必须关联到一个版本
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
                    len: [3, 100], // 缺陷标题长度限制
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            stepsToReproduce: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            severity: {
                type: DataTypes.ENUM('high', 'medium', 'low'),
                defaultValue: 'medium',
            },
            status: {
                type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
                defaultValue: 'open',
            },
        },
        {
            sequelize,
            modelName: 'Defect',
            tableName: 'Defects',
            timestamps: true,
            indexes: [
                {
                    unique: false,
                    fields: ['title'],
                    name: 'idx_defects_title',
                },
            ],
        }
    );

    return Defect;
};
