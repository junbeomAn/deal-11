const express = require('express');
const router = express.Router();
const con = require('../db/create');

/* GET users listing. */
router.post('/signin', function (req, res, next) {
  const { username } = req.body;
  const query = `SELECT * FROM USERS WHERE USERNAME = ?`;

  con
    .execute(query, [username])
    .then(([results, fields]) => {
      console.log(results);
      if (results.length) {
        req.session.isLogin = true;
        res.json({ message: '로그인이 완료되었습니다.', ok: true });
      } else {
        res.status(401).json({ message: '로그인 실패', ok: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Server Error', ok: false });
    });
});
// /auth/signin
router.post('/signup', function (req, res, next) {
  const { username, location_one, location_two } = req.body;
  const query = `SELECT * FROM USERS WHERE USERNAME = ?`;

  con
    .execute(query, [username])
    .then(([results, fields]) => {
      if (!results.length) {
        const query = `INSERT INTO USERS(USERNAME, LOCATION_ONE, LOCATION_TWO) VALUES(?, ?, ?)`;
        con
          .execute(query, [username, location_one, location_two || null])
          .then(() => {
            res.json({ message: '회원가입이 완료되었습니다', ok: true });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: 'Sign up Server Error', ok: false });
          });
      } else {
        res.json({ message: '이미 존재하는 사용자 이름입니다.', ok: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Sign up Server Error', ok: false });
    });
});

module.exports = router;
