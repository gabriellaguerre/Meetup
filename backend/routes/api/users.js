const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post('/', async (req, res) => {
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
