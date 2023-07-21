
const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {

  // -----初始化及中介掛載
  app.use(passport.initialize());
  // 相當於app.use(passport.authenticate('session'))  使用session驗證策略
  app.use(passport.session());

  // -----設定登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {

          if (!user) {
            // 如果使用者不存在
            return done(null, false, { message: 'Not registered Email!' });
          }

          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                // 如果密碼不正確
                return done(null, false, { message: 'Incorrect Password!' });
              }

              // 非上兩者為成功登入
              return done(null, user);
            })
        }).catch(err => done(err, false));
    }))

  // -----設定序列化及反序列化
  // 在session中同時儲存id, username
  passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username });
  });

  // user(從session取出的資料)已經包含了所需要的資訊，不必再進資料庫
  passport.deserializeUser((user, done) => {
    done(null, user);
  })

}






