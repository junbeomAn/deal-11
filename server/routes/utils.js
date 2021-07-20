const createError = require('http-errors');
const app = require('../app');

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
  return function () {
    if (!req.session.user) next(createError(401, '로그인을 해주세요.'));
    else return true;
  };
}

module.exports = {
  injectAuthStateToSession,
  convertLocationToArray,
  runAsyncWrapper,
  requiredLoginDecorator,
};
