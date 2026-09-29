const { validationResult } = require('express-validator');
const bottleService = require('../services/bottleService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const createBottle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { textContent, mediaUrl } = req.body;
    // req.user is set by the auth middleware
    const bottle = await bottleService.castBottle(req.user.id, textContent, mediaUrl);

    return successResponse(res, 201, bottle, 'Bottle cast into the ocean');
  } catch (error) {
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const bottles = await bottleService.getOceanFeed();
    return successResponse(res, 200, bottles, 'Ocean feed retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createBottle, getFeed };