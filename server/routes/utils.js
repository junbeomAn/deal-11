const injectAuthStateToSession = (req, { id, location, username }) => {
  req.session.user = {
    isLogin: true,
    userId: id,
    location,
    username,
  };
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
