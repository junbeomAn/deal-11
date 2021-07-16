const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const dbInit = require('./db/init');

const app = express();

const PORT = process.env.PORT || 3000;

dbInit();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true },
  })
);

app.use('/auth', authRouter);
app.use(function (req, res, next) {
  // 이 이후 라우터는 로그인 안되어 있으면 접근불가.
  const { user } = req.session;
  if (!user) {
    res.status(401).json({ message: 'No authorized', ok: false });
  } else {
    next();
  }
});
app.use('/api/v1', indexRouter);

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
