const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const CREATED_STATUS = 201;
const OK_STATUS = 200;

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена.');
    })
    .then((card) => {
      if (card.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки.');
      }
      return Card.findByIdAndRemove(card._id)
        .then(() => {
          res.send(card);
        });
    })
    .catch(next);
};

const toggleLike = (req, res, next, data, status) => {
  Card.findByIdAndUpdate(req.params.cardId, data, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена.');
    })
    .then((card) => {
      res.status(status).send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  toggleLike(req, res, { $addToSet: { likes: req.user._id } }, CREATED_STATUS, next);
};

const dislikeCard = (req, res, next) => {
  toggleLike(req, res, { $pull: { likes: req.user._id } }, OK_STATUS, next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
