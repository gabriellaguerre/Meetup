const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
     let user = {}

      const { firstName, lastName, email, username, password } = req.body;
      const userOne = await User.signup({ firstName, lastName, email, username, password });

      let token = await setTokenCookie(res, userOne);
      userOne.token = token

      user.id = userOne.id
      user.firstName = userOne.firstName;
      user.lastName = userOne.lastName;
      user.email = userOne.email;
      user.token = userOne.token

      return res.json({
        user: user
      });
    }
  );

module.exports = router;
