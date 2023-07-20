
const express = require('express');
const router = express.Router();

// (頁面)註冊表單
router.get('/register', (req, res) => {
  res.render('register');
})

// (功能)註冊
router.post('/register', (req, res) => {

  const [name, email, password, confirmPassword] = req.body;

  console.log(`${name}, ${email}, ${password}, ${confirmPassword}`);




})

// (頁面)登入表單頁
router.get('/login', (req, res) => {

})

// (功能)登入
router.post('/login', (req, res) => {

})

// (功能)登出
router.get('/logout', (req, res) => {

})

module.exports = router;


