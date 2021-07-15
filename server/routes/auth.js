const express = require('express');
const router = express.Router();
const pool = require('../db/index.js');
const { injectAuthStateToSession, getNewUserInfo } = require('./utils');

// /auth
router.post('/signin', function (req, res, next) {
  const { username } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;
  const arguments = [username];
  pool
    .execute(query, arguments)
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = getNewUserInfo(results[0]);

        injectAuthStateToSession(req, userInfo);
        res.json({ message: '로그인이 완료되었습니다.', ...userInfo, ok: true });
      } else {
        res.status(401).json({ message: '로그인 실패', ok: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Sign in Server Error', err, ok: false });
    });
});

router.post('/signup', function (req, res, next) {
  const { username, location } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;
  const locationString = location.join(';') + ';';
  console.log(locationString)

  pool
    .execute(query, [username])
    .then(([results, fields]) => {
      if (!results.length) {
        const query = `INSERT INTO USERS(username, location) VALUES(?, ?)`;
        const arguments = [username, locationString]
        pool
          .execute(query, arguments)
          .then(() => {
            res.json({ message: '회원가입이 완료되었습니다', ok: true });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: 'Sign up Server Error', err, ok: false });
          });
      } else {
        res
          .status(409)
          .json({ message: '이미 존재하는 사용자 이름입니다.', ok: false });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Sign up Server Error', err, ok: false });
    });
});

router.get('/signout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) { 
      console.error(err);
      next(err);
    }
    res.status(200).send({ message: '로그아웃 되었습니다', ok: true });
  });
})

module.exports = router;
