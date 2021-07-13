var express = require('express');
var router = express.Router();

/* GET home page. */

// /api/v1
router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;
