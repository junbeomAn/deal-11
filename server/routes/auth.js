const express = require('express');

const router = express.Router();
const pool = require('../db/index.js');
const { injectAuthStateToSession, runAsyncWrapper, createError } = require('./utils');

// /auth
router.post('/signin', runAsyncWrapper(async (req, res, next) => {
  const { username } = req.body;
  const selectQuery = `SELECT * FROM users WHERE username = ?`;
  const arguments = [username];
  const [results] = await pool.execute(selectQuery, arguments);
  
  if (results.length === 0) {
    next(createError(401, '존재하지 않는 사용자', { ok: false }));
    return ;
  }

  const selectLocationNameQuery = `SELECT name FROM LOCATIONS WHERE id = ?`;
  const { id, location_1_id, location_2_id } = results[0];
  const locationArray = [];

  const [locationOne] = await pool.execute(selectLocationNameQuery, [location_1_id]);
  locationArray.push(locationOne[0].name);

  if (location_2_id) {
    const [locationTwo] = await pool.execute(selectLocationNameQuery, [location_2_id]);
    locationArray.push(locationTwo[0].name);
  }
  
  const result = { id, username, location: locationArray };
  injectAuthStateToSession(req, result);
  res.send({ message: '로그인이 완료되었습니다.', result, ok: true });  
}));

router.post('/signup', runAsyncWrapper(async (req, res, next) => {
  const { username, location } = req.body;
  const selectQuery = `SELECT * FROM users WHERE username = ?`;
  const arguments = [username];

  const [results] = await pool.execute(selectQuery, arguments);

  if (results.length > 0) {
    next(createError(409, '이미 존재하는 사용자 이름입니다.', { ok: false }));
    return ;
  }

  const firstLocationIdQuery = `SELECT id FROM LOCATIONS WHERE name = '${location[0]}'`;
  let insertQuery = '';
  if (location[1]) {
    const secondLocationIdQuery = `SELECT id FROM LOCATIONS WHERE name = '${location[1]}'`;
    insertQuery = `INSERT INTO USERS(username, location_1_id, location_2_id) VALUES(?, (${firstLocationIdQuery}), (${secondLocationIdQuery}))`;
  } else {
    insertQuery = `INSERT INTO USERS(username, location_1_id) VALUES(?, (${firstLocationIdQuery}))`;
  }

  await pool.execute(insertQuery, arguments);
  res.send({ message: '회원가입이 완료되었습니다', ok: true });
  
}));

router.get('/signout', (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) { 
      next(err);
      return ;
    }
    res.status(200).send({ message: '로그아웃 되었습니다', ok: true });
  });
})

module.exports = router;
