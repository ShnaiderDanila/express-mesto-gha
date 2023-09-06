const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const handleError = require('./errors/errorHandler');
const { signUpValidation, signInValidation } = require('./middlewares/validation');

const app = express();

app.use(cookieParser());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);

app.use(auth);

app.use(routes);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => { });
