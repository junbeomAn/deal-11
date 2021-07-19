const express = require('express');

const productRouter = require('./product/index.js');
const chatRouter = require('./chat/index.js');
const router = express.Router();
const { requiredLoginDecorator } = require('./utils.js');

router.use('/product', productRouter);
router.use(
  '/chat',
  function (req, res, next) {
    if (requiredLoginDecorator(req, next)()) next();
  },
  chatRouter
);

module.exports = router;
