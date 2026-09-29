const { Bottle, User } = require('../models');

const castBottle = async (castawayId, textContent, mediaUrl) => {
  const bottle = await Bottle.create({
    castawayId,
    textContent,
    mediaUrl,
    status: 'floating'
  });
  return bottle;
};

const getOceanFeed = async () => {
  // Navigators see bottles that are currently 'floating'
  const bottles = await Bottle.findAll({
    where: { status: 'floating' },
    include: [{
      model: User,
      as: 'castaway',
      attributes: ['id', 'name'] // Keep it anonymous or just show name based on your gamification rules
    }],
    order: [['createdAt', 'DESC']]
  });
  return bottles;
};

module.exports = { castBottle, getOceanFeed };