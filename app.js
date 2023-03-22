
//environment setting 僅在非正式環境時使用dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/.env'})
}


/********** environment setting **********/

//require express & setup
const express = require('express');
const app = express();
const port = 3000;

//require handlebars (注意v7使用方式有別)
const exphbs = require('express-handlebars').engine;

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//setting static file directory
app.use(express.static('public'));

//setting body-parser
app.use(express.urlencoded({ extended: true }))



//********** preload from DB **********/

//loading data from database
let restaurants = [];

const mongoose = require('mongoose');
const restaurantModel = require('./models/restaurantModel');


//後端連線後先預載restaurants資料，以免使用者沒有進首頁
mongoose.connect(process.env.MONGODB_URI)
.then( () => {
    console.log('mongodb connected!');
    return restaurantModel.find().lean();   //要加lean()否則handlebars讀不到屬性

}).then( items => {
    //put DB data into restaurants
    restaurants = items;

}).catch( err => {
    console.log('mongodb error:', err);
})



//********** routing **********/

//setting router
//（頁面）首頁
app.get('/', (req, res) => {

    //重讀，以免資料有更新
    restaurantModel.find().lean()
    .then( items => restaurants = items)
    .catch( err => console.log(err));

    res.render('index', { restaurants });
})

//（功能）搜尋
app.get('/search', (req, res) => {

    //依關鍵字篩選餐廳，若無則顯示無符合資料
    const keyword = req.query.keyword.trim();

    if (!keyword) {
        return res.redirect('/');
    }

    const filteredRestaurants = restaurants.filter( 
        (item) => item.name.toLowerCase().includes(keyword.toLowerCase()));
    
    res.render('index', { restaurants: filteredRestaurants,
                          keyword,
                          isNoResult: (filteredRestaurants.length===0)});
})


//（頁面）新增
app.get('/restaurants/new', (req, res) => {

    res.render('new');
})


//（功能）新增
app.post('/restaurants/new', (req, res) => {

    let newId;

    //取號：取得目前的最大id, 再加1可以得到新的id
    restaurantModel.findOne().sort({id: -1}).limit(1)
    .then( restaurant => {

        newId = Math.floor(restaurant.id+1);

        // console.log('newId:', newId)
        // console.log('newItem:', {...req.body, id: newId} )

        //建立新物件：表單傳過來的值再加上id
        return restaurantModel.create({...req.body, id: newId})

    }).then( () => res.redirect('/') )      //創建成功後重新導向
    .catch( err => console.log(err));


    //console.log('req.body', req.body)

})

app.get('/restaurants/edit/:id', (req, res) => {

    // 傳入該id的餐廳資料
    const restaurant = restaurants.find( 
        item => item._id.toString() === req.params.id);

    res.render('edit', { restaurant });
})

//（頁面）詳細資料
app.get('/restaurants/:id', (req, res) => {

    //傳入該id的餐廳資料
    const restaurant = restaurants.find(
        (item) => item._id.toString() === req.params.id);
    res.render('show', { restaurant });
})


//start listening
app.listen(port, () => {
    console.log(`restaurant website is now listening on http://localhost:${port}`);
})

