const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');

dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const { runAsyncWrapper, requiredLoginDecorator } = require('./routes/utils');
const dbInit = require('./db/init');
const { updateUserLocationQuery } = require('./routes/query');
const { selectOrInsertLocation } = require('./routes/location.js');

const app = express();

const PORT = process.env.PORT || 3000;

dbInit();
global.appPublic = path.resolve(__dirname + '/public');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(
  cors({
    credentials: true,
    origin: process.env.PUBLIC_DNS || 'http://127.0.0.1:5500',
  })
);

app.use('/auth', authRouter);
app.use('/api/v1', indexRouter);
app.get(
  '/myinfo',
  runAsyncWrapper(async (req, res, next) => {
    const myinfo = await new Promise((resolve, reject) => {
      const { token } = req.headers;
      const SECRET_KEY = process.env.COOKIE_SECRET;

      if (!token) {
        resolve(false);
      }

      jwt.verify(token, SECRET_KEY, {}, (err, decode) => {
        if (!decode) {
          resolve(false);
        } else {
          resolve(decode);
        }
      });
    });
    if (myinfo) {
      res.send({ login: true, myinfo });
    } else {
      res.send({ login: false });
    }
  })
);
const pool = require('./db/index.js');
app.put(
  '/myinfo',
  runAsyncWrapper(async (req, res, next) => {
    try {
      const myinfo = await requiredLoginDecorator(req, next);
      const { location } = req.body;
      if (!location.length) {
        next(createError(400, '최소 한 동네 이상이 등록되어야 합니다.'));
        return;
      }

      const locations = [];
      const locationOneId = await selectOrInsertLocation(location[0]);
      locations.push(locationOneId);

      if (location[1]) {
        const locationTwoId = await selectOrInsertLocation(location[1]);
        locations.push(locationTwoId);
      }
      await pool.execute(updateUserLocationQuery(myinfo.id, locations));
      const { id, username } = myinfo;
      const payload = {
        id,
        username,
        location,
      };
      const SECRET_KEY = process.env.COOKIE_SECRET;
      jwt.sign(payload, SECRET_KEY, {}, (err, token) => {
        const result = { id, username, location, token };
        res.send({ message: '동네 수정이 완료되었습니다.', result, ok: true });
      });
    } catch (err) {
      next(err);
    }
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    message: err.message || 'Server Error!',
    status: err.status,
    ok: err.ok || false,
  });
});

app.listen(PORT, () => {
  console.log(`${PORT} is listening`);
});

module.exports = app;
