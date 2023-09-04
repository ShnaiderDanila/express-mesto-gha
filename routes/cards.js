const cardsRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardIdValidation, cardCreateValidation } = require('../middlewares/validation');

cardsRouter.get('/', getCards);

cardsRouter.post('/', cardCreateValidation, createCard);

cardsRouter.delete('/:cardId', cardIdValidation, deleteCard);

cardsRouter.put('/:cardId/likes', cardIdValidation, likeCard);

cardsRouter.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardsRouter;
