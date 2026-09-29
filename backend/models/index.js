const User = require('./User');
const Bottle = require('./Bottle');

// Associations
User.hasMany(Bottle, { foreignKey: 'castawayId', as: 'bottles' });
Bottle.belongsTo(User, { foreignKey: 'castawayId', as: 'castaway' });

module.exports = { User, Bottle };