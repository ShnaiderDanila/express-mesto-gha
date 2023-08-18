const Card = require('../models/card');

const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;

const updateOptions = {
  new: true,
  runValidators: true,
};

const getCards = (req, res) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (cards.length === 0) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточки не найдены.' });
      }
      return res.send(cards);
    })
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Карточка с указанным _id:${req.params.cardId} не найдена.` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, updateOptions)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(DEFAULT_ERROR).send({ err });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, updateOptions)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: `Передан несуществующий _id:${req.params.cardId} карточки.` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
