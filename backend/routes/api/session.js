const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];


// Log in
router.post('/', validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;
      // console.log(credential, password, 'jJJJJJJJJJJJJJ')
      const user = await User.login({ credential, password });

      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
     //   err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

      await setTokenCookie(res, user);

      const user1 = {}
      user1.id = user.id
      user1.firstName = user.firstName
      user1.lastName = user.lastName
      user1.email = user.email
      user1.username = user.username


      return res.json(user1);
    }
);

// Log out
router.delete('/', (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'Successfully Logged Out' });
    }
  );

// Restore session user
router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({ user: null });
  }
);


module.exports = router;
