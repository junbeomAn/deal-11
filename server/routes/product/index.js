const express = require('express');

const router = express.Router();
const pool = require('../../db/index.js');
const { upload, makeImageUrlString, getProductsWithImageUrlArray } = require('./utils.js');

// /product
router.get('/', function (req, res) {
  const { offset = 0, category } = req.query;
  const userIdSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const categoryIdSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const arguments = [];
  
  let selectProductQuery = `SELECT id, title, content, created_at, (${userIdSubQuery}) AS 'username', (${categoryIdSubQuery}) AS 'category', image_url, location_one FROM PRODUCTS B`;

  if (category) {
    selectProductQuery += ` HAVING category = ?`;
    arguments.push(category)
  }
  
  selectProductQuery += ` LIMIT 15 OFFSET ?`
  arguments.push(String(offset))
  
  pool
    .execute(selectProductQuery, arguments)
    .then(([products, fields]) => {
      const result = getProductsWithImageUrlArray(products);
      
      res.status(200).send(result);
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

router.post('/', upload.array('product-images'), (req, res) => {
  // front html form 에서 input field name => product-images
  const { userId } = req.session;
  const { title, content, category, locationOne } = req.body;
  const categoryIdSubQuery = `SELECT id FROM CATEGORIES WHERE NAME = '${category}' LIMIT 1`;
  const query = `INSERT INTO PRODUCTS(title, content, user_id, category_id, image_url, location_one) VALUES(?, ?, ?, (${categoryIdSubQuery}), ?, ?)`;
  const image_url = makeImageUrlString(req.files);
  const arguments = [title, content, userId, image_url, locationOne];

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
  .get((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {});


module.exports = router;
