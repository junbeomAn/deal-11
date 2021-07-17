const express = require('express');

const pool = require('../../db/index.js');
const router = express.Router();
const { upload, makeImageUrlString, getProductsWithImageUrlArray } = require('./image.js');
const { runAsyncWrapper, requiredLoginDecorator } = require('../utils');
const { selectOrInsertLocation } = require('../location.js');
const {
  locationIdQuery
} = require('../query.js');

const FETCH_COUNT = 10;

// /product
router.get('/', runAsyncWrapper(async (req, res) => {
  const { page = 0, selected } = req.query;
  const arguments = [String(page)];
  const { user } = req.session;
  const currentLocation = user.location[selected];

  const userNameSubQuery = `SELECT username FROM USERS A WHERE A.id = B.user_id`;
  const locationIdSubQuery = `SELECT id FROM LOCATIONS WHERE name = '${currentLocation}' LIMIT 1`;
  const locationNameSubQuery = `SELECT name FROM LOCATIONS WHERE name = '${currentLocation}' LIMIT 1`;
  let selectProductQuery = `SELECT B.id, title, created_at, (${userNameSubQuery}) AS 'username', (${locationNameSubQuery})AS 'location', image_url, price FROM PRODUCTS B`;
  selectProductQuery += ` WHERE B.location_id = (${locationIdSubQuery})`;
  selectProductQuery += ` ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`;

  const [products] = await pool.execute(selectProductQuery, arguments);
  const result = getProductsWithImageUrlArray(products);
  res.send({ ok: true, result });
}));

router.get('/category/:category_name', runAsyncWrapper(async (req, res) => { // query: page, selected / params: category_name
  const { page = 0, selected } = req.query;
  const { category_name } = req.params;
  const arguments = [category_name, String(page)];
  const { user } = req.session;
  const currentLocation = user.location[selected];
  
  const categoryNameSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const userNameSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const locationIdSubQuery = `SELECT id FROM LOCATIONS WHERE name = '${currentLocation}' LIMIT 1`;
  const locationNameSubQuery = `SELECT name FROM LOCATIONS WHERE name = '${currentLocation}' LIMIT 1`;
  let selectProductQuery = `SELECT B.id, title, created_at, (${userNameSubQuery}) AS 'username', (${categoryNameSubQuery}) AS 'category', (${locationNameSubQuery}) AS 'location', image_url, price FROM PRODUCTS B`;
  selectProductQuery += ` WHERE B.location_id = (${locationIdSubQuery})`;
  selectProductQuery += ` HAVING category = ? ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`

  const [products] = await pool.execute(selectProductQuery, arguments);
  const result = getProductsWithImageUrlArray(products);
  res.send({ ok: true, result });
}));

router.get('/mine', runAsyncWrapper(async (req, res) => {
  const { user } = req.session;
  const { page = 0 } = req.query;
  const arguments = [user.userId, String(page)];
  
  const locationNameSubQuery = `SELECT name FROM LOCATIONS WHERE PRODUCTS.location_id = LOCATIONS.id`;
  let selectProductQuery = `SELECT id, title, user_id, created_at, (${locationNameSubQuery}) AS location, image_url, price FROM PRODUCTS WHERE user_id = ?`;
  selectProductQuery += ` ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`;

  const [products] = await pool.execute(selectProductQuery, arguments);
  const result = getProductsWithImageUrlArray(products);
  res.send({ ok: true, result });
}));

router.get('/:productId', runAsyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const arguments = [productId];

  const userNameSubQuery = `SELECT username FROM users A WHERE A.id = B.user_id`;
  const categoryNameSubQuery = `SELECT name FROM categories A WHERE A.id = B.category_id`;
  const locationNameSubQuery = `SELECT name FROM LOCATIONS WHERE id = B.location_id`;
  let selectProductQuery = `SELECT id, title, content, created_at, (${userNameSubQuery}) AS 'username', (${categoryNameSubQuery}) AS 'category', (${locationNameSubQuery}) AS 'location', image_url, price FROM PRODUCTS B`;
  selectProductQuery += ' HAVING id = ? LIMIT 1';
  
  const [product] = await pool.execute(selectProductQuery, arguments);
  const result = getProductsWithImageUrlArray(product)[0];
  res.send({ ok: true, result });
}));



// upload.array 로 여러개 받을수 있음. product-images는 client input 태그의 name 속성과 일치시킨다.
// 업로드 된 파일은 req.files에 배열형태로 저장된다.
// 필요한 json 데이터는 String으로 전달하여 전달받아 server에서 parsing한다.
requiredLoginDecorator(router);
router.post('/', upload.array('product-images'), runAsyncWrapper(async (req, res) => {
  // front html form 에서 input field name => product-images
  const { userId } = req.session.user;
  const { title, content, category_id, price, location } = JSON.parse(req.body.json);
  const image_url = makeImageUrlString(req.files);
  const location_id = await selectOrInsertLocation(location);
  const arguments = [title, content, userId, category_id, image_url, price, location_id];
  const insertQuery = `INSERT INTO PRODUCTS(title, content, user_id, category_id, image_url, price, location_id) VALUES(?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.execute(insertQuery, arguments);
  res.send({ ok: true, detail_id: result.insertId });
}));


router
  .route('/:productId')
  .put((req, res) => {})
  .delete((req, res) => {});


module.exports = router;
