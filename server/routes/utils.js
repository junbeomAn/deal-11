const injectAuthStateToSession = (req, id) => {
  req.session.isLogin = true;
  req.session.userId = id;
};

module.exports = {
  injectAuthStateToSession,
};
