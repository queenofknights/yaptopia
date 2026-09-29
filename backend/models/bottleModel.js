const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bottle = sequelize.define('Bottle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  castawayId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  textContent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('floating', 'active_session', 'resolved'),
    defaultValue: 'floating',
  },
}, {
  tableName: 'bottles',
  timestamps: true,
});

module.exports = Bottle;