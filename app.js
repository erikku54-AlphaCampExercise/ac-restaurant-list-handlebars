

/** ******** module setting **********/

// require express & setup
const express = require('express');
const app = express();
const port = 3000;

// require handlebars (注意v7使用方式有別)
const exphbs = require('express-handlebars').engine;

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// setting static file directory
app.use(express.static('public'));

// setting body-parser
app.use(express.urlencoded({ extended: true }));

// setting method-override
const methodOveride = require('method-override');
app.use(methodOveride('_method'));



/** ********* preload from DB **********/

const db = require('./config/mongoose');

// loading data from database
let restaurants = [];

// const mongoose = require('mongoose');
const restaurantModel = require('./models/restaurantModel');

db.once('open', () => {

  restaurantModel.find()
    .lean() // 要加lean()否則handlebars讀不到屬性
    .then(items => {
    // put DB data into restaurants
      restaurants = items;
    })
})




/** *********** routing ************/

// setting router
// （頁面）首頁
app.get('/', (req, res) => {

  // 重讀，以免資料有更新
  restaurantModel.find().lean()
    .then(items => {
      restaurants = items
      res.render('index', { restaurants });
    }).catch(err => console.log(err));
})

// （功能）搜尋
app.get('/search', (req, res) => {

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


// （頁面）新增餐廳
app.get('/restaurants/new', (req, res) => {

  res.render('new');
})


// （功能）新增餐廳
app.post('/restaurants/', (req, res) => {

  let newId;

  // 取號：取得目前的最大id, 再加1可以得到新的id
  restaurantModel.findOne().sort({ id: -1 })
    .then(restaurant => {

      newId = Math.floor(restaurant.id + 1);

      // console.log('newId:', newId)
      // console.log('newItem:', {...req.body, id: newId} )

      // 建立新物件：表單傳過來的值再加上id
      return restaurantModel.create({ ...req.body, id: newId })

    }).then(() => res.redirect('/?status=1')) // 創建成功後重新導向，並附狀態碼
    .catch(err => console.log(err));

  // console.log('req.body', req.body)
})

// (頁面) 修改餐廳
app.get('/restaurants/:id/edit', (req, res) => {

  // 傳入該id的餐廳資料
  const restaurant = restaurants.find(
    item => item._id.toString() === req.params.id);

  res.render('edit', { restaurant });
})

// (功能) 修改餐廳
app.put('/restaurants/:id', (req, res) => {

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

  // console.log('req.body', req.body)
})

// （功能）刪除餐廳
app.delete('/restaurants/:id', (req, res) => {

  const _id = req.params.id;

  restaurantModel.deleteOne({ _id })
    .then(() => res.redirect('/?status=3')) // 創建成功後重新導向，並附狀態碼
    .catch(err => console.log(err));

})


// （頁面）詳細資料
app.get('/restaurants/:id', (req, res) => {

  // 傳入該id的餐廳資料
  const restaurant = restaurants.find(
    (item) => item._id.toString() === req.params.id);
  res.render('show', { restaurant });
})


// start listening
app.listen(port, () => {
  console.log(`restaurant website is now listening on http://localhost:${port}`);
})

