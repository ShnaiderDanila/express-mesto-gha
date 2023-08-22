const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64df1377bfe76ffdb8c5a68a',
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {});
