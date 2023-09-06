const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { signUpValidation, signInValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const routes = require('./routes/index');
const handleErrors = require('./errors/errorsHandler');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);

app.use(auth);
app.use(routes);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => { });
