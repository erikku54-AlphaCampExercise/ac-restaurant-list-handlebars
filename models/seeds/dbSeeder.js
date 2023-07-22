
// environment setting 僅在非正式環境時使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './.env' });
}

const db = require('../../config/mongoose'); // 取得連線

const userModel = require('../userModel');
const restaurantModel = require('../restaurantModel');
const users = require('./seeds.json').users;
const restaurants = require('./seeds.json').restaurants;

const bcrypt = require('bcryptjs');


db.once('open', () => {

  // 先將密碼加密處理
  users.forEach(user => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;
  })

  Promise.all([userModel.create(users), restaurantModel.create(restaurants)])
    .then(() => {
      console.log('Database seed data was created successfully.')
      return Promise.all([userModel.findOne({ name: 'User1' }), userModel.findOne({ name: 'User2' })]);
    })
    .then(users => Promise.all([restaurantModel.updateMany({ id: { $in: [1, 2, 3] } }, { userId: users[0]._id }),
      restaurantModel.updateMany({ id: { $in: [4, 5, 6] } }, { userId: users[1]._id })]))
    .then(() => {
      console.log('User-Restaurant relation was set successfully.');
      process.exit();
    })
    .catch(err => console.log('mongodb error:', err));
})
