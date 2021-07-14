const express = require('express');

const productRouter = require('./product/index.js');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('index');
});

router.use('/product', productRouter);

module.exports = router;
