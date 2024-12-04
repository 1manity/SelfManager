'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TaskRule extends Model {}

    TaskRule.init(
        {
            // 任务标题
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            // 任务描述
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            // 任务创建的频率
            frequency: {
                type: DataTypes.ENUM,
                values: ['daily', 'weekly'],
                allowNull: false,
            },
            // 每周几执行（仅在 frequency 为 'weekly' 时使用）
            daysOfWeek: {
                type: DataTypes.JSON, // 修改为 JSON 类型
                allowNull: true,
                // 在应用逻辑中，存储为数组，例如 [0, 2, 4] 表示周日、周二、周四
            },
            // 任务创建的时间（24小时制）
            timeOfDay: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            // 下次运行时间
            nextRun: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            // 规则是否激活
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'TaskRule',
            tableName: 'TaskRules',
            timestamps: true,
        }
    );

    TaskRule.associate = (models) => {
        TaskRule.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };

    return TaskRule;
};
