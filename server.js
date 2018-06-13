const express = require('express');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const {Blogs} = require('./models');

const jsonParer = bodyParser.json();
const app = express();

app.use(morgan('common'));