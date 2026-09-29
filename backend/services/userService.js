const { User } = require('../models');

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] } // Never return the hashed password
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = { getUserProfile };