const express = require('express');

const router = express.Router();
const pool = require('../db/index.js');
const createError = require('http-errors'); 
const { selectOrInsertLocation } = require('./location.js');
const { runAsyncWrapper, requiredLoginDecorator } = require('./utils');
const jwt = require('jsonwebtoken');

const { 
  insertUserHasOneLocationQuery,
  insertUserHasTwoLocationQuery,
  existsUserQuery,
  selectUserQuery,
  selectLocationNameQuery
} = require('./query.js');

// /auth
router.post('/signin', runAsyncWrapper(async (req, res, next) => {
  const { username } = req.body;
  const arguments = [username];
  const [results] = await pool.execute(selectUserQuery, arguments);
  
  if (results.length === 0) {
    next(createError(401, '존재하지 않는 사용자', { ok: false }));
    return ;
  }

  const { id, location_1_id, location_2_id } = results[0];
  const locationArray = [];

  const [locationOne] = await pool.execute(selectLocationNameQuery, [location_1_id]);
  locationArray.push(locationOne[0].name);

  if (location_2_id) {
    const [locationTwo] = await pool.execute(selectLocationNameQuery, [location_2_id]);
    locationArray.push(locationTwo[0].name);
  }
  const SECRET_KEY = process.env.COOKIE_SECRET;
  const payload = {
    id,
    username,
    location: locationArray,
  }
  jwt.sign(payload, SECRET_KEY, {}, (err, token) => {
    const result = { username, location: locationArray, token };
    res.send({ message: '로그인이 완료되었습니다.', result, ok: true }); 
  })
}));

router.post('/signup', runAsyncWrapper(async (req, res, next) => {
  const { username, location } = req.body;
  const arguments = [username];

  const [result, _] = await pool.execute(existsUserQuery, arguments);
  const isExisted = result[0].result;

  if (isExisted) {
    next(createError(409, '이미 존재하는 사용자 이름입니다.', { ok: false }));
    return ;
  }

  const locationOneId = await selectOrInsertLocation(location[0]);
  arguments.push(locationOneId);

  let insertQuery;
  if (location[1]) {
    const locationTwoId = await selectOrInsertLocation(location[1]);
    arguments.push(locationTwoId);
    insertQuery = insertUserHasTwoLocationQuery
  } else {
    insertQuery = insertUserHasOneLocationQuery
  }

  await pool.execute(insertQuery, arguments);
  res.status(201).send({ message: '회원가입이 완료되었습니다', ok: true });
  
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
