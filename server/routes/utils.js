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

function requiredLoginDecorator(router) {
  return router.use((req, _, next) => {
    const { user } = req.session;

    if (user) {
      next();
    } else {
      next(createError(401, 'please login', { ok: false }));
    }
  });
}

module.exports = {
  injectAuthStateToSession,
  convertLocationToArray,
  runAsyncWrapper,
  requiredLoginDecorator,
};
