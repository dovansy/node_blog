require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const db = require('./config/db');

// connect database mongodb
db.connect();

// start app
const app = express();
const port = process.env.PORT;

// Http logger
app.use(morgan('combined'));

// Template handlebar
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.get('/', (req, res) => {
  res.json('home');
});

app.get('/news', (req, res) => {
  res.render('news');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
