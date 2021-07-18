const express = require('express');
const createError = require('http-errors');
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
  selectProductDetailQuery,
  selectProductListQuery,
  selectCategoryItemsQuery,
  selectMyProductQuery,
} = require('../query.js');
const { NotExtended } = require('http-errors');

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


router.get('/mine', runAsyncWrapper(async (req, res, next) => {
  const isAuthorized = requiredLoginDecorator(req, next)();
  if(isAuthorized) {
    const { user } = req.session;
    const { page = 1 } = req.query;
    const arguments = [user.userId, String((page-1)*10)];
    
    const [products] = await pool.execute(selectMyProductQuery(), arguments);
    const result = getProductsWithImageUrlArray(products);
    res.json({ ok: true, result });
  }
}));

router.get('/:productId', runAsyncWrapper(async (req, res, next) => {
  const { productId } = req.params;
  const { user } = req.session;
  const arguments = [productId];
  
  const [product] = await pool.execute(selectProductDetailQuery(user? user : {userId: 0}), arguments);
  if (product.length === 0){
    next(createError(404, "존재하지 않는 게시물입니다."));
  } else {
    const result = getProductsWithImageUrlArray(product)[0];
    res.send({ ok: true, result });
  }
}));


// upload.array 로 여러개 받을수 있음. product-images는 client input 태그의 name 속성과 일치시킨다.
// 업로드 된 파일은 req.files에 배열형태로 저장된다.
// 필요한 json 데이터는 String으로 전달하여 전달받아 server에서 parsing한다.
router.post('/', upload.array('product-images'), runAsyncWrapper(async (req, res, next) => {
  const { userId } = req.session.user;
  const { title, content, category_id, price, location } = JSON.parse(req.body.data);
  const image_url = makeImageUrlString(req.files);
  const location_id = await selectOrInsertLocation(location);
  const arguments = [title, content, userId, category_id, image_url, price, location_id];

  const [result] = await pool.execute(insertProductQuery, arguments);
  res.send({ ok: true, detail_id: result.insertId });

}));

router.post('/like/:productId', runAsyncWrapper(async (req, res, next) => {
  const isAuthorized = requiredLoginDecorator(req, next)();
  if (isAuthorized){
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
  }
}));



// router
//   .route('/:productId')
//   .put((req, res) => {})
//   .delete((req, res) => {});


module.exports = router;
