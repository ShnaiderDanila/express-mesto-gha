const mongoose = require('mongoose');
const Card = require('../models/card');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const CREATED_STATUS = 201;

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: 'На сервере произошла ошибка' });
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
      return res.send({ message: 'На сервере произошла ошибка' });
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
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
