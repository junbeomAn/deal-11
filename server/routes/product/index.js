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
  const arguments = [];
  const { user } = req.session;
  const currentLocation = user.location[selected];

  const userIdSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const locationSubQuery = `SELECT id FROM USERS WHERE location LIKE '%${currentLocation}%'`;
  let selectProductQuery = `SELECT B.id, title, created_at, (${userIdSubQuery}) AS 'username', image_url FROM PRODUCTS B RIGHT JOIN (${locationSubQuery}) AS C ON B.user_id = C.id`;
  selectProductQuery += ` ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`

  arguments.push(String(page));

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

router.get('/category/:category_name', (req, res) => {
  const { page = 0 } = req.query;
  const { category_name } = req.params;
  const FETCH_COUNT = 10;
  const userIdSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const categoryIdSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const arguments = [];
  
  let selectProductQuery = `SELECT id, title, content, created_at, (${userIdSubQuery}) AS 'username', (${categoryIdSubQuery}) AS 'category', image_url, location_one FROM PRODUCTS B`;

  if (category) {
    selectProductQuery += ` HAVING category = ?`;
    arguments.push(category)
  }

  selectProductQuery += ` LIMIT ${FETCH_COUNT} OFFSET ?`
  arguments.push(String(page))


})

router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  const userIdSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const categoryIdSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const arguments = [productId];

  let selectProductQuery = `SELECT id, title, content, created_at, (${userIdSubQuery}) AS 'username', (${categoryIdSubQuery}) AS 'category', image_url, location_one FROM PRODUCTS B`;
  selectProductQuery += ' HAVING id = ? LIMIT 1';
  // console.log(selectProductQuery)
  pool
    .execute(selectProductQuery, arguments)
    .then(([products, fields]) => {
      const result = getProductsWithImageUrlArray(products)[0];
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).json({ message: 'Product read error', ok: false, err });
    })
})



router.post('/', upload.array('product-images'), (req, res) => {
  // front html form 에서 input field name => product-images
  const { userId } = req.session.user;
  const { title, content, category, price } = req.body;
  const categoryIdSubQuery = `SELECT id FROM CATEGORIES WHERE NAME = '${category}' LIMIT 1`;
  const query = `INSERT INTO PRODUCTS(title, content, user_id, category_id, image_url, price) VALUES(?, ?, ?, (${categoryIdSubQuery}), ?, ?)`;
  const image_url = makeImageUrlString(req.files);
  const arguments = [title, content, userId, image_url, price];

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

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { offset } = req.query;
  const userIdSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const categoryIdSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const arguments = [userId, offset];

  let selectProductQuery = `SELECT id, title, content, created_at, (${userIdSubQuery}) AS 'username', (${categoryIdSubQuery}) AS 'category', image_url, location_one FROM PRODUCTS B`;
  selectProductQuery += ' WHERE user_id = ? LIMIT 15 OFFSET ?';


})

router
  .route('/:productId')
  .put((req, res) => {})
  .delete((req, res) => {});


module.exports = router;
