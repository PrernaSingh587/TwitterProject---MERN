const express = require('express');
const route = express.Router();
const { check } = require('express-validator');

const {userController} = require('../controllers/user.controller')
const {feedbackController} = require('../controllers/feedback.controller')

route.get('/login', userController.getLoginUser);
route.post('/login',
[
    check('username')
    .not()
    .isEmpty(),
    check('password')
    .not()
    .isEmpty()
],
userController.postLoginUser);
route.get('/signup', userController.getSignUpUser);
route.post('/signup', [
    check('username')
    .not()
    .isEmpty()
    .isLength({min : 3}),
    check('name')
    .not()
    .isEmpty()
    .isLength({min : 3}),
    check('password')
    .not()
    .isEmpty()
    .isLength({min : 6}),
    check('email')
    .not()
    .isEmpty()
    .normalizeEmail()
    .isEmail()
], userController.postSignUpUser);
route.post('/:username/follow', userController.postFollowUser);
route.post('/:username/unfollow',userController.postUnfollowUser);
route.get('/followers', userController.getFollowers);
route.get('/following', userController.getFollowing);
route.delete('/delete',userController.postTerminateAccount);
//oute.post('/feedback',feedbackController)

//profile views - reach
//test ...
//jwt 
// rmq tweet



module.exports = route;