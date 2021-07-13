var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.post('/signin', function(req, res, next) {
  const { username } = req.body;
  User.findOne({
    where: { username }
  })
  .then(user => {
    if (user.length) {
      req.session.isLogin = true;
      res.json({ message: "로그인이 완료되었습니다. "});
    } else {
      res.status(401).json({message: "로그인 실패"});
    }
  })
  .catch(err => {
    res.status(500).json({message: "server error"});
  })
});

router.post('/signup', function(req, res, next) {
  
});

module.exports = router;
