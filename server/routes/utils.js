const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const injectAuthStateToSession = (req, { id, location, username }) => {
  req.session.user = {
    isLogin: true,
    userId: id,
    location,
    username,
  };
};

const convertLocationToArray = (userInfo) => {
  const { location_1_id, location_2_id, id, username } = userInfo;
  const location = [location_1_id];
  if (location_2_id) location.push(location_2_id);

  return {
    id,
    username,
    location,
  };
};

function runAsyncWrapper(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}

function requiredLoginDecorator(req, next) {
  return new Promise((resolve, reject) => {
    const { token } = req.headers;
    const SECRET_KEY = process.env.COOKIE_SECRET;

    if (!token) {
      reject(new Error(401));
    }

    jwt.verify(token, SECRET_KEY, {}, (err, decode) => {
      if (!decode) {
        reject(new Error(401));
      } else {
        resolve(decode);
      }
    });
  });
}

module.exports = {
  injectAuthStateToSession,
  convertLocationToArray,
  runAsyncWrapper,
  requiredLoginDecorator,
};
