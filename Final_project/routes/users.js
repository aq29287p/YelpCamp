const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    //register page
    .get(users.renderRegister)
    //register new user
    .post(catchAsync(users.register));


router.route('/login')
    //login page
    .get(users.renderLogin)
    //login user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//logout user
router.get('/logout', users.logout);


module.exports = router;





