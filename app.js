

/** ******** module setting **********/

// environment setting 僅在非正式環境時使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './.env' });
}

// require express & setup
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// require handlebars (注意v7使用方式有別)
const exphbs = require('express-handlebars').engine;

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// setting static file directory
app.use(express.static('public'));

// setting body-parser
app.use(express.urlencoded({ extended: true }));

// setting session
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

const flash = require('connect-flash');
app.use(flash());

// setting method-override
const methodOveride = require('method-override');
app.use(methodOveride('_method'));

// setting passport
const userPassport = require('./config/passport');
userPassport(app);

// setting local variable
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  return next();
})

// setting router
const routes = require('./routes');
app.use(routes);

// 開啟連線(要引入這檔案才會連線，但不一定要拿來賦值)
require('./config/mongoose');

// start listening
app.listen(port, () => {
  console.log(`restaurant website is now listening on http://localhost:${port}`);
})

