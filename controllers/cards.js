const mongoose = require('mongoose');
const Card = require('../models/card');

const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const CREATED_STATUS = 201;
const OK_STATUS = 200;

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send(card))
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Карточка с указанным _id:${req.params.cardId} не найдена.` });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const toggleLikeStatus = (req, res, data, status) => {
  Card.findByIdAndUpdate(req.params.cardId, data, { new: true })
    .orFail()
    .then((card) => {
      res.status(status).send(card);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  toggleLikeStatus(req, res, { $addToSet: { likes: req.user._id } }, CREATED_STATUS);
};

const dislikeCard = (req, res) => {
  toggleLikeStatus(req, res, { $pull: { likes: req.user._id } }, OK_STATUS);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
