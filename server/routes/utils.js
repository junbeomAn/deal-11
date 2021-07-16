const injectAuthStateToSession = (req, { id, location, username }) => {
  req.session.user = {
    isLogin: true,
    userId: id,
    location,
    username,
  };
};

const convertLocationStrToArray = (userInfo) => {
  const locationArray = userInfo.location.split(';');
  locationArray.pop();

  return {
    ...userInfo,
    location: locationArray,
  };
};

function runAsyncWrapper(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}

module.exports = {
  injectAuthStateToSession,
  convertLocationStrToArray,
  runAsyncWrapper,
};
