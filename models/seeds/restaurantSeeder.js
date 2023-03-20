
//開發期使用dotenv
if (process.env.NODE_ENV !== 'production') {
    // console.log(require('dotenv').config());

    require('dotenv').config({ path: __dirname + '/../../.env'});
}


const mongoose = require('mongoose');
const restaurantModel = require('../restaurantModel');
const restaurants = require('../../restaurant.json').results;


mongoose.connect(process.env.MONGODB_URI)
.then( () => {
    console.log('mongodb connected!');

    return restaurantModel.create(restaurants)
        
}).then( () => {

    console.log("Database Seed data was created successfully.")

}).catch( (err) => console.log('mongodb error:',err))