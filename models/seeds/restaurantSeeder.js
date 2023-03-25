

const db = require('./../../config/mongoose'); // 取得連線

const restaurantModel = require('../restaurantModel');
const restaurants = require('../../restaurant.json').results;

db.once('open', () => {

  restaurantModel.create(restaurants)
    .then(() => {
      console.log('Database Seed data was created successfully.')
    }).catch((err) => console.log('mongodb error:', err));
})
