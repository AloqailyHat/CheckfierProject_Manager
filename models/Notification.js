const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Notification = sequelize.define('Notification', {
  type: {
    type: DataTypes.ENUM('question', 'rating', 'redeem', 'points'),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});
module.exports = Notification;