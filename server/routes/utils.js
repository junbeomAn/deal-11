const createError = require('http-errors');

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

module.exports = {
  injectAuthStateToSession,
  convertLocationToArray,
  runAsyncWrapper,
  createError,
};
