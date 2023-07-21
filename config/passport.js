
const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        // password欄位為必填，因此隨機產生8碼亂數填寫
        const randomPassword = Math.random().toString(36).slice(-8);

        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({ name, email, password: hash }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // -----設定序列化及反序列化
  // 在session中同時儲存id, username
  passport.serializeUser((user, done) => {
    done(null, { id: user.id, name: user.name });
  });

  // user(從session取出的資料)已經包含了所需要的資訊，不必再進資料庫
  passport.deserializeUser((user, done) => {
    done(null, user);
  })

}






