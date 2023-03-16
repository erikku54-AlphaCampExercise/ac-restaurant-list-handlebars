
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
app.use(express.static('public'))


const restaurants = require("./restaurant.json");

//setting router
app.get('/', (req, res) => {

    res.render('index', {restaurants: restaurants.results});
})

app.get('/restaurants/:id', (req, res) => {

    //傳入該id的餐廳資料
    const restaurant = restaurants.results.find(
        (item) => item.id.toString() === req.params.id);
    res.render('show', { restaurant });
})

app.get('/search', (req, res) => {

    //依關鍵字篩選餐廳，若無則顯示無符合資料
    const filteredRestaurants = restaurants.results.filter( 
        (item) => item.name.toLowerCase().includes(req.query.keyword.trim().toLowerCase()));
    res.render('index', {restaurants: filteredRestaurants, isNoResult: (filteredRestaurants.length===0)});
})


//start listening
app.listen(port, () => {
    console.log(`restaurant website is now listening on http://localhost:${port}`);
})

