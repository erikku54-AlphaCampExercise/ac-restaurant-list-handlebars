
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    "id": {
        type: Number,
        require: true,
    },
    "name": {
        type: String,
        require: true,
    },
    "name_en": String,
    "category": {
        type: String,
        require: true,
    },
    "image": String,
    "location": String,
    "phone": String,
    "google_map": String,
    "rating": Number,
    "description": String    
})

//編譯成Model物件後輸出
module.exports = mongoose.model('Restaurant', restaurantSchema);