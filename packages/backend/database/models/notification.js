'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            // 通知关联到接收者
            Notification.belongsTo(models.User, {
                foreignKey: 'receiverId',
                as: 'receiver',
            });

            // 通知关联到发送者
            Notification.belongsTo(models.User, {
                foreignKey: 'senderId',
                as: 'sender',
            });

            // 通知关联到项目
            Notification.belongsTo(models.Project, {
                foreignKey: 'projectId',
                as: 'project',
            });
        }
    }

    Notification.init(
        {
            receiverId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            type: {
                type: DataTypes.ENUM('requirement_assigned', 'defect_assigned', 'comment_added'),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            resourceType: {
                type: DataTypes.ENUM('requirement', 'defect', 'comment'),
                allowNull: false,
            },
            resourceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            projectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Projects',
                    key: 'id',
                },
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'Notification',
            tableName: 'Notifications',
            timestamps: true,
        }
    );

    return Notification;
};
