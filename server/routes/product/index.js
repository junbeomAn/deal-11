const express = require('express');

const pool = require('../../db/index.js');
const router = express.Router();
const { upload, makeImageUrlString, getProductsWithImageUrlArray } = require('./image.js');
const { runAsyncWrapper, requiredLoginDecorator } = require('../utils');
const { selectOrInsertLocation } = require('../location.js');
const {
  locationIdQuery,
  insertProductQuery,
  deleteLikeQuery,
  insertLikeQuery,
  selectProductListQuery,
  selectCategoryItemsQuery,
} = require('../query.js');

const FETCH_COUNT = 10;

// /product
// '/' : 상품 전체 정보 가져오기
// location, page 정보를 query로 받아와 상황에 맞게 응답한다.
// location 없으면 그냥 전체 product 정보를 전달한다.
router.get('/', runAsyncWrapper(async (req, res) => {
  const { page = 1, location } = req.query;
  const arguments = [String((page-1)*FETCH_COUNT)];

  const [products] = await pool.execute(selectProductListQuery(location), arguments);
  const result = getProductsWithImageUrlArray(products);
  res.send({ ok: true, result });
}));

router.get('/category/:category_id', runAsyncWrapper(async (req, res) => { // query: page, selected / params: category_name
  const { page = 1, location } = req.query;
  const { category_id } = req.params;
  const arguments = [String((page-1)*FETCH_COUNT)];

  const [products] = await pool.execute(selectCategoryItemsQuery(location, category_id), arguments);
  const result = getProductsWithImageUrlArray(products);

  res.send({ ok: true, result });
}));

router.get('/:productId', runAsyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const arguments = [productId];
  
  const [product] = await pool.execute(selectProductQuery, arguments);
  const result = getProductsWithImageUrlArray(product)[0];
  res.send({ ok: true, result });
}));


// 여기서 부턴 로그인된 사용자만 사용 가능하다.
requiredLoginDecorator(router);

// upload.array 로 여러개 받을수 있음. product-images는 client input 태그의 name 속성과 일치시킨다.
// 업로드 된 파일은 req.files에 배열형태로 저장된다.
// 필요한 json 데이터는 String으로 전달하여 전달받아 server에서 parsing한다.
router.post('/', upload.array('product-images'), runAsyncWrapper(async (req, res) => {
  // front html form 에서 input field name => product-images
  const { userId } = req.session.user;
  const { title, content, category_id, price, location } = JSON.parse(req.body.json);
  const image_url = makeImageUrlString(req.files);
  const location_id = await selectOrInsertLocation(location);
  const arguments = [title, content, userId, category_id, image_url, price, location_id];

  const [result] = await pool.execute(insertProductQuery, arguments);
  res.send({ ok: true, detail_id: result.insertId });
}));

router.post('/like/:productId', runAsyncWrapper(async (req, res) => {
  const { userId } = req.session.user;
  const { productId } = req.params;
  const arguments = [userId, productId];

  const [result] = await pool.execute(deleteLikeQuery, arguments);
  if (result.affectedRows) {
    res.send({ like: false });
  } else {
    await pool.execute(insertLikeQuery, arguments);
    res.status(201).json({ like: true });
  }
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


router
  .route('/:productId')
  .put((req, res) => {})
  .delete((req, res) => {});


module.exports = router;
