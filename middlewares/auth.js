const { JWT_SECRET } = process.env;
const UNAUTHORIZED_ERROR = 401;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
