const express = require('express');
const router = express.Router(); // 引用express路由器

const restaurants = require('./modules/restaurants');
const users = require('./modules/users')
const home = require('./modules/home');

router.use('/restaurants', restaurants);
router.use('/users', users);
router.use('/', home);

module.exports = router; // 匯出設定的express路由器
