const injectAuthStateToSession = (req, { id, location, username }) => {
  req.session.isLogin = true;
  req.session.userId = id;
  req.session.location = location;
  req.session.username = username;
};

const getNewUserInfo = (userInfo) => {
  const locationArray = userInfo.location.split(';');
  locationArray.pop();

  return {
    ...userInfo,
    location: locationArray,
  };
};

module.exports = {
  injectAuthStateToSession,
  getNewUserInfo,
};
