

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
