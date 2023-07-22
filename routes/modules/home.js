const express = require('express');
const router = express.Router(); // 引用express路由器



// 模型載入
const restaurantModel = require('./../../models/restaurantModel');


// setting router
// （頁面）首頁
router.get('/', (req, res) => {

  // 讀取資料庫
  restaurantModel.find({ userId: req.user._id }).sort({ name: 1 }).lean()
    .then(restaurants => {
      res.render('index', { restaurants, status: req.query.status }); // 傳入status作為alert判斷依據
    }).catch(err => console.log(err));
})

// （功能）搜尋
router.get('/search', (req, res) => {

  // 依關鍵字篩選餐廳，若無則顯示無符合資料
  const keyword = req.query.keyword.trim();
  const sort = req.query.sort;

  if (!keyword && sort === '1') {
    return res.redirect('/');
  }

  let option;

  switch (sort) {
    case '2':
      option = { name: -1 }
      break;
    case '3':
      option = { category: 1 }
      break;
    case '4':
      option = { location: 1 }
      break;
    default:
      option = { name: 1 }
      break;
  }

  restaurantModel.find({ userId: req.user._id }).sort(option).lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(
        (item) => item.name.toLowerCase().includes(keyword.toLowerCase()));

      res.render('index', {
        restaurants: filteredRestaurants,
        keyword,
        sort,
        isNoResult: (filteredRestaurants.length === 0)
      });
    })
})




module.exports = router; // 匯出設定的express路由器
