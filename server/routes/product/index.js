const express = require('express');

const router = express.Router();
const pool = require('../../db/index.js');
const { upload, makeImageUrlString, getProductsWithImageUrlArray } = require('./utils.js');

router.use(function (req, res, next) { // 이 이후 라우터는 로그인 안되어 있으면 접근불가.
  const { user } = req.session;
  if (!user) {
    res.status(401).json({ message: 'No authorized', ok: false });
  } else {
    next();
  }
});

// /product
router.get('/', function (req, res) {
  const { page = 0, selected } = req.query;
  const FETCH_COUNT = 10;
  const arguments = [String(page)];
  const { user } = req.session;
  const currentLocation = user.location[selected];

  const userNameSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const locationIdSubQuery = `SELECT id FROM USERS WHERE location LIKE '%${currentLocation}%'`;
  let selectProductQuery = `SELECT B.id, title, created_at, (${userNameSubQuery}) AS 'username', image_url, price FROM PRODUCTS B`;
  selectProductQuery += ` RIGHT JOIN (${locationIdSubQuery}) AS C ON B.user_id = C.id`;
  selectProductQuery += ` ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`;

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

router.get('/category/:category_name', function(req, res) { // query: page, selected / params: category_name
  const { page = 0, selected } = req.query;
  const { category_name } = req.params;
  const FETCH_COUNT = 10;
  const arguments = [category_name, String(page)];
  const { user } = req.session;
  const currentLocation = user.location[selected];
  
  const categoryNameSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const userNameSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const locationIdSubQuery = `SELECT id FROM USERS WHERE location LIKE '%${currentLocation}%'`;
  let selectProductQuery = `SELECT B.id, title, created_at, (${userNameSubQuery}) AS 'username',(${categoryNameSubQuery}) AS 'category', image_url, price FROM PRODUCTS B`;
  selectProductQuery += ` RIGHT JOIN (${locationIdSubQuery}) AS C ON B.user_id = C.id`;
  selectProductQuery += ` HAVING category = ? ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`

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

router.get('/mine', function(req, res) {
  const { selected } = req.query;
  const { user } = req.session;
  const currentLocation = user.location[selected];
  const locationSubQuery = `SELECT location FROM USERS WHERE location LIKE '%${currentLocation}%' LIMIT 1`;
  let selectProductQuery = `SELECT id, title, user_id, created_at, (${locationSubQuery}) AS location, image_url, price FROM PRODUCTS WHERE user_id = ?`;
  const arguments = [user.userId];

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

router.get('/:productId', function(req, res) {
  const { productId } = req.params;
  const userNameSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const categoryNameSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const arguments = [productId];

  let selectProductQuery = `SELECT id, title, content, created_at, (${userNameSubQuery}) AS 'username', (${categoryNameSubQuery}) AS 'category', image_url, price FROM PRODUCTS B`;
  selectProductQuery += ' HAVING id = ? LIMIT 1';
  
  pool
    .execute(selectProductQuery, arguments)
    .then(([products, fields]) => {
      const result = getProductsWithImageUrlArray(products)[0];
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).json({ message: 'Product read error', ok: false, err });
    })
});


// upload.array 로 여러개 받을수 있음. product-images는 client input 태그의 name 속성과 일치시킨다.
// 업로드 된 파일은 req.files에 배열형태로 저장된다.
router.post('/', upload.array('product-images'), function(req, res) {
  // front html form 에서 input field name => product-images
  const { userId } = req.session.user;
  const { title, content, category, price } = req.body;
  const categoryIdSubQuery = `SELECT id FROM CATEGORIES WHERE NAME = '${category}' LIMIT 1`;
  const insertQuery = `INSERT INTO PRODUCTS(title, content, user_id, category_id, image_url, price) VALUES(?, ?, ?, (${categoryIdSubQuery}), ?, ?)`;
  const image_url = makeImageUrlString(req.files);
  const arguments = [title, content, userId, image_url, price];

  pool
    .execute(insertQuery, arguments)
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
