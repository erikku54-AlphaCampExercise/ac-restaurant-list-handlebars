
//environment setting 僅在非正式環境時使用dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/.env'})
}


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


//loading data from database
let restaurants = [];

const mongoose = require('mongoose');
const restaurantModel = require('./models/restaurantModel');

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



//setting router
app.get('/', (req, res) => {

    res.render('index', { restaurants });
})

app.get('/restaurants/:id', (req, res) => {

    //傳入該id的餐廳資料
    const restaurant = restaurants.find(
        (item) => item.id.toString() === req.params.id);
    res.render('show', { restaurant });
})

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


//start listening
app.listen(port, () => {
    console.log(`restaurant website is now listening on http://localhost:${port}`);
})

