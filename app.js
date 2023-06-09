

/** ******** module setting **********/

// require express & setup
const express = require('express');
const app = express();
const port = 3000;

// require handlebars (注意v7使用方式有別)
const exphbs = require('express-handlebars').engine;

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// setting static file directory
app.use(express.static('public'));

// setting body-parser
app.use(express.urlencoded({ extended: true }));

// setting method-override
const methodOveride = require('method-override');
app.use(methodOveride('_method'));

// setting router
const routes = require('./routes');
app.use(routes);

// 開啟連線(要引入這檔案才會連線，但不一定要拿來賦值)
require('./config/mongoose');

// start listening
app.listen(port, () => {
  console.log(`restaurant website is now listening on http://localhost:${port}`);
})

