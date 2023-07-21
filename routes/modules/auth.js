
const express = require('express');
const router = express.Router();

const passport = require('passport');

// 向facebook發出請求，參數scope是向facebook要求的資料
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));

// facebook詢問使用者後把資料回傳的地方，類似POST /users/login
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}));

module.exports = router;
