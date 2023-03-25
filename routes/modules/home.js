const express = require('express');
const router = express.Router(); // 引用express路由器


// 共用變數
let restaurants = [];
const restaurantModel = require('./../../models/restaurantModel');


// 資料預讀
// const db = require('./config/mongoose');

// db.once('open', () => {
//   restaurantModel.find()
//     .lean() // 要加lean()否則handlebars讀不到屬性
//     .then(items => {
//     // put DB data into restaurants
//       restaurants = items;
//     })
// })


// setting router
// （頁面）首頁
router.get('/', (req, res) => {

  // 重讀，以免資料有更新
  restaurantModel.find().lean()
    .then(items => {
      restaurants = items
      res.render('index', { restaurants });
    }).catch(err => console.log(err));
})

// （功能）搜尋
router.get('/search', (req, res) => {

  // 依關鍵字篩選餐廳，若無則顯示無符合資料
  const keyword = req.query.keyword.trim();

  if (!keyword) {
    return res.redirect('/');
  }

  const filteredRestaurants = restaurants.filter(
    (item) => item.name.toLowerCase().includes(keyword.toLowerCase()));

  res.render('index', {
    restaurants: filteredRestaurants,
    keyword,
    isNoResult: (filteredRestaurants.length === 0)
  });
})



module.exports = router; // 匯出設定的express路由器
