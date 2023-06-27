const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Recommendation = sequelize.define('recommendation', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bookId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Recommendation;
