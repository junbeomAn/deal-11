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
        res.json({ message: '로그인이 완료되었습니다.' });
      } else {
        res.status(401).json({ message: '로그인 실패', ok: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Server Error', ok: false });
    });
});

router.post('/signup', function (req, res, next) {});

module.exports = router;
