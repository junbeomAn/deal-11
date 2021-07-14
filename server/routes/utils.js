const injectAuthStateToSession = (req) => {
  req.session.isLogin = true;
  req.session.userId = results[0].id;
};

module.exports = {
  injectAuthStateToSession,
};
