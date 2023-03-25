
// environment setting 僅在非正式環境時使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').join(__dirname, '/../.env') });
}


const mongoose = require('mongoose');

// 設定連線
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('mongodb connected!');
  }).catch(err => {
    console.log('mongodb error:', err);
  });

const db = mongoose.connection;

module.exports = db;
