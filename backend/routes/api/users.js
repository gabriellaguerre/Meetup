const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post(
    '/',
    async (req, res) => {
      const { firstName, lastName, email, username, password } = req.body;
      const user = await User.signup({ firstName, lastName, email, username, password });

      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
  );

module.exports = router;
