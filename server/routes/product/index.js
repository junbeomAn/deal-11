const express = require('express');

const router = express.Router();
const pool = require('../../db/index.js');
const { upload, makeImageUrlString, getProductsWithImageUrlArray } = require('./utils.js');

// /product
router.get('/all', function (req, res) {
  const query = `SELECT * FROM PRODUCTS LIMIT 15`;
  const arguments = [];
  pool
    .execute(query, arguments)
    .then(([products, fields]) => {
      const results = getProductsWithImageUrlArray(products);

      res.status(200).send(results);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'Product Fetch Server Error', err, ok: false });
    });
});

router.use(function (req, res, next) { // 이 이후 라우터는 로그인 안되어 있으면 접근불가.
  if (!req.session.isLogin) {
    res.status(401).json({ message: 'No authorized', ok: false });
  } else {
    next();
  }
});

router.post('/new', upload.array('product-images'), (req, res) => {
  // front html form 에서 input field name => product-images
  // console.log(req.files);
  const { userId } = req.session;
  const { title, content, categoryId } = req.body;
  const query = `INSERT INTO PRODUCTS(TITLE, CONTENT, USER_ID, CATEGORY_ID, IMAGE_URL) VALUES(?, ?, ?, ?, ?)`;
  const image_url = makeImageUrlString(req.files);
  const arguments = [title, content, userId, categoryId, image_url];

  // console.log(title, content, userId, categoryId, image_url);
  pool
    .execute(query, arguments)
    .then(([results, fields]) => {
      res.json({ message: '상품 등록이 완료되었습니다.', ok: true });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'New Product Server Error', err, ok: false });
    });
});

router
  .route('/:productId')
  .put((req, res) => {})
  .delete((req, res) => {});

module.exports = router;
