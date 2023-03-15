const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
   const group = await Group.findAll();
   res.json(group)
})



module.exports = router;
