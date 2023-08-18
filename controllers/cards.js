const Card = require('../models/card');

const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

const updateOptions = {
  new: true,
  runValidators: true,
  upsert: true,
};

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: 'Карточки не найдены.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: `Карточка с указанным _id:${req.params.cardId} не найдена.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, updateOptions)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ err });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, updateOptions)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
