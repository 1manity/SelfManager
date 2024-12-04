'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {}

    Task.init(
        {
            // 任务标题
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            // 任务描述
            description: {
                type: DataTypes.STRING,
                allowNull: true, // 描述可以为空
            },
            // 任务截止时间
            dueDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            // 任务状态
            status: {
                type: DataTypes.ENUM,
                values: ['pending', 'in-progress', 'completed'],
                defaultValue: 'pending', // 默认任务状态为待处理
            },
        },
        {
            sequelize,
            modelName: 'Task',
            tableName: 'Tasks', // 数据库中的表名
            timestamps: true, // Sequelize 会自动管理 `createdAt` 和 `updatedAt`
            hooks: {
                // 这里可以添加任务状态更新的钩子，例如任务完成时可以自动更新状态
            },
        }
    );

    // 任务与用户的关联（每个任务属于一个用户）
    Task.associate = (models) => {
        Task.belongsTo(models.User, {
            foreignKey: 'userId', // 明确指定外键名称
            as: 'user',
            allowNull: false,
            onDelete: 'CASCADE',
        });
    };

    return Task;
};
