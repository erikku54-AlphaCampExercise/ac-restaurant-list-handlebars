
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  id: Number,
  name: {
    type: String,
    required: true
  },
  name_en: String,
  category: {
    type: String,
    required: true
  },
  image: String,
  location: String,
  phone: String,
  google_map: String,
  rating: Number,
  description: String,
  userId: {
    type: Schema.Type.ObjectId,
    ref: 'User',
    index: true,
    // required: true
  }
})

// 編譯成Model物件後輸出
module.exports = mongoose.model('Restaurant', restaurantSchema);