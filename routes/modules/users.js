
const express = require('express');
const router = express.Router();

const User = require('../../models/userModel');

const passport = require('passport');
const bcrypt = require('bcryptjs');

// (頁面)註冊表單
router.get('/register', (req, res) => {
  res.render('register');
})

// (功能)註冊
router.post('/register', (req, res) => {

  const { name, email, password, confirmPassword } = req.body;

  const errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填！' });
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' });
  }

  if (errors.length) {
    return res.render('register', { errors, ...req.body });
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        // console.log(user);
        errors.push({ message: '這個email已註冊過！' });
        return res.render('register', { errors, ...req.body });
      }

      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(() => {
          req.flash('success_msg', '註冊成功，請重新登入。');
          res.redirect('/users/login');
        })
    }).catch(err => console.log(err));

})

// (頁面)登入表單頁
router.get('/login', (req, res) => {
  res.render('login');
})

// (功能)登入
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// (功能)登出
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return console.log(err);
    req.flash('success_msg', '登出成功! 請重新登入。');
    res.redirect('/users/login');
  })
})

module.exports = router;


