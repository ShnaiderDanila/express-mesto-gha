require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const handleError = require('./errors/errorHandler');

const app = express();

app.use(cookieParser());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(routes);

app.use(handleError);

app.listen(PORT, () => { });
