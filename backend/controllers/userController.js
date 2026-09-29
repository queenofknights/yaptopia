const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    return successResponse(res, 200, user, 'Profile retrieved successfully');
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

module.exports = { getProfile };