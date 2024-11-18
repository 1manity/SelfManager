'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('./models')
const initDatabase = async () => {


    try {
        // 测试数据库连接
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 同步模型到数据库
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    return { sequelize };
};

module.exports = initDatabase;
