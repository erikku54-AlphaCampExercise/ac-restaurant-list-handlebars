const express = require('express');
const router = express.Router(); // 引用express路由器


const restaurantModel = require('./../../models/restaurantModel');

// （頁面）新增餐廳
router.get('/new', (req, res) => {
  res.render('new');
})

// （功能）新增餐廳
router.post('/', (req, res) => {

  let newId;

  // 取號：取得目前的最大id, 再加1可以得到新的id
  restaurantModel.findOne().sort({ id: -1 })
    .then(restaurant => {
      newId = Math.floor(restaurant.id + 1);

      // 建立新物件：表單傳過來的值再加上id
      return restaurantModel.create({ ...req.body, id: newId })

    }).then(() => res.redirect('/?status=1')) // 創建成功後重新導向，並附狀態碼
    .catch(err => console.log(err));

  // restaurantModel.create(req.body)
  //   .then(() => res.redirect('/?status=1')) // 創建成功後重新導向，並附狀態碼
  //   .catch(err => console.log(err));

})

// (頁面) 修改餐廳
router.get('/:id/edit', (req, res) => {

  // 傳入該id的餐廳資料
  restaurantModel.findOne({ _id: req.params.id })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err));

})

// (功能) 修改餐廳
router.put('/:id', (req, res) => {
  const _id = req.params.id;
  restaurantModel.findById(_id)
    .then(restaurant => {

      restaurant.name = req.body.name;
      restaurant.name_en = req.body.name_en;
      restaurant.category = req.body.category;
      restaurant.image = req.body.image;
      restaurant.location = req.body.location;
      restaurant.phone = req.body.phone;
      restaurant.google_map = req.body.google_map;
      restaurant.rating = req.body.rating;
      restaurant.description = req.body.description;

      return restaurant.save();

    }).then(() => res.redirect('/?status=2')) // 創建成功後重新導向，並附狀態碼
    .catch(err => console.log(err));
})

// （功能）刪除餐廳
router.delete('/:id', (req, res) => {

  const _id = req.params.id;

  restaurantModel.deleteOne({ _id })
    .then(() => res.redirect('/?status=3')) // 創建成功後重新導向，並附狀態碼
    .catch(err => console.log(err));
})


// （頁面）詳細資料
router.get('/:id', (req, res) => {

  // 傳入該id的餐廳資料
  restaurantModel.findOne({ _id: req.params.id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err));
})


module.exports = router; // 匯出設定的express路由器
