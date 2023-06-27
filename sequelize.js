const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sql12629145', 'sql12629145', 'itWEFvfXkR', {
  host: 'sql12.freemysqlhosting.net',
  dialect: 'mysql',
  dialectModule: require('mysql2')
});

module.exports = sequelize;
