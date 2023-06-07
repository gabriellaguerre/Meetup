const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .not()
    .isEmpty()
    .withMessage('*First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .not()
    .isEmpty()
    .withMessage('*Last Name is required'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('*Please enter a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('*Please provide a username with at least 4 characters.'),
  // check('username')
  //   //  .not()
  //   .exists({checkFalsy: true})
  //   .isEmail()
  //   .withMessage('*Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('*Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
  let user = {}

  const { firstName, lastName, email, username, password } = req.body;

  console.log(req.body, "IN USER ROUTE LINE 46")

  if(username.includes('@') || username.includes('.com')) {
    const err = new Error("*Username cannot be an email")
    err.status = 403;
    err.errors = {username: "*Username cannot be an email"}
    return next(err);
  }

  const checkEmail = await User.findOne({
    where: {email}
  })

  if (checkEmail) {
    const err = new Error("*User already exists");
    err.status = 403;
    err.errors = { email: "*User with that email already exists" };
    return next(err);

  } else {
    const userOne = await User.signup(req.body);

    let token = await setTokenCookie(res, userOne);
    userOne.token = token

    user.id = userOne.id
    user.firstName = userOne.firstName;
    user.lastName = userOne.lastName;
    user.email = userOne.email;
    user.token = userOne.token

    return res.json(user);
  }
});

router.get('/', async (req, res) => {

   const user = await User.findAll();

   return res.json(user)

})

module.exports = router;
