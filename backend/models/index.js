const User = require('./userModel');
const Bottle = require('./bottleModel');

// Associations
User.hasMany(Bottle, { foreignKey: 'castawayId', as: 'bottles' });
Bottle.belongsTo(User, { foreignKey: 'castawayId', as: 'castaway' });

module.exports = { User, Bottle };