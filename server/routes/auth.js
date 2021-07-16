const express = require('express');
const router = express.Router();
const pool = require('../db/index.js');
const { injectAuthStateToSession, convertLocationStrToArray, runAsyncWrapper } = require('./utils');

// /auth
router.post('/signin', runAsyncWrapper(async (req, res, next) => {
  const { username } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;
  const arguments = [username];
  const [results] = await pool.execute(query, arguments);

  if (results.length > 0) {
    const userInfo = convertLocationStrToArray(results[0]);
    injectAuthStateToSession(req, userInfo);
    res.send({ message: '로그인이 완료되었습니다.', ...userInfo, ok: true });
  } else {
    res.status(401).send({ message: '로그인 실패', ok: false });
  }
}));

router.post('/signup', runAsyncWrapper(async (req, res, next) => {
  const { username, location } = req.body;
  const selectQuery = `SELECT * FROM users WHERE username = ?`;
  const arguments = [username];

  const [results] = await pool.execute(selectQuery, arguments);

  if (results.length === 0) {
    const insertQuery = `INSERT INTO USERS(username, location) VALUES(?, ?)`;
    const locationString = location.join(';') + ';';
    const arguments = [username, locationString];

    await pool.execute(insertQuery, arguments);
    res.send({ message: '회원가입이 완료되었습니다', ok: true });
  } else {
    res
      .status(409)
      .send({ message: '이미 존재하는 사용자 이름입니다.', ok: false });
  }
}));

router.get('/signout', (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) { 
      console.error(err);
      next(err);
    }
    res.status(200).send({ message: '로그아웃 되었습니다', ok: true });
  });
})

module.exports = router;
