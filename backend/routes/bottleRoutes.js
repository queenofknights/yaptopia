const express = require('express');
const { body } = require('express-validator');
const bottleController = require('../controllers/bottleController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// All bottle routes require authentication
router.use(verifyToken);

router.post(
  '/',
  [
    body('textContent').optional().isString(),
    body('mediaUrl').optional().isURL().withMessage('Must be a valid URL'),
    body().custom((value, { req }) => {
      if (!req.body.textContent && !req.body.mediaUrl) {
        throw new Error('Bottle must contain either text content or media');
      }
      return true;
    })
  ],
  bottleController.createBottle
);

router.get('/', bottleController.getFeed);

module.exports = router;