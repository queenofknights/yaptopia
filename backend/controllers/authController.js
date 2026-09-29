const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { name, email, password, role } = req.body;
    const user = await authService.registerUser(name, email, password, role);
    
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    return successResponse(res, 201, userWithoutPassword, 'User registered successfully');
  } catch (error) {
    if (error.message === 'Email already in use') {
      return errorResponse(res, 409, error.message);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    // Set HTTP-only cookie for secure session management
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    return successResponse(res, 200, { user: userWithoutPassword, token }, 'Login successful');
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};

module.exports = { register, login };