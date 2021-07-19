const express = require('express');
const createError = require('http-errors');

const pool = require('../../db/index.js');
const { runAsyncWrapper } = require('../utils.js');
const { getProductsWithImageUrlArray } = require('../product/image.js');
const {
  selectChatAuthorized,
  insertMessageQuery,
  selectExistRoomQuery,
  selectChatRoomValidQuery,
  insertChatRoomQuery,
  deleteChatRoomQuery,
  selectChatRoomAllQuery,
} = require('../query.js');

const router = express.Router();

router.get(
  '/',
  runAsyncWrapper(async (req, res, next) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const { userId } = req.session.user;
      const [result] = await connection.query(selectChatRoomAllQuery(userId));
      const rooms = getProductsWithImageUrlArray(result);
      res.send({ ok: true, rooms });
    } catch (err) {
      console.log(err);
      next(createError(500, err.message));
    } finally {
      connection.release();
    }
  })
);
router.post(
  '/message/:toId/:productId',
  runAsyncWrapper(async (req, res, next) => {
    const { userId } = req.session.user;
    const { toId, productId } = req.params;
    if (userId == toId)
      next(createError(400, '본인에게 채팅을 하실 수 없습니다.'));
    const [check] = await pool.execute(
      selectExistRoomQuery(productId, userId, toId)
    );
    if (check[0].exist === 0) {
      const [res] = await pool.execute(selectChatRoomValidQuery, [
        userId,
        productId,
        toId,
        productId,
      ]);
      if (res[0].isSeller || !res[0].sellerHas) {
        next(createError(401, '채팅방을 개설하실 수 없습니다.'));
      } else {
        await pool.execute(insertChatRoomQuery, [productId, toId, userId]);
        next();
      }
    } else {
      next();
    }
  }),
  runAsyncWrapper(async (req, res, next) => {
    const { content } = req.body;
    const { userId } = req.session.user;
    const { toId, productId } = req.params;
    await pool.execute(insertMessageQuery(productId, userId, toId, content));
    res.send({ ok: true });
  })
);
router.get(
  '/:roomId',
  runAsyncWrapper(async (req, res, next) => {
    res.send({ ok: true });
  })
);
router.delete(
  '/:roomId',
  runAsyncWrapper(async (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.session.user;
    const [check] = await pool.execute(selectChatAuthorized(roomId, userId));
    console.log(check);
    if (check[0].authorized) {
      await pool.execute(deleteChatRoomQuery, [roomId]);
      res.send({ ok: true });
    } else {
      next(createError(401, '삭제 권한 없음'));
    }
  })
);

module.exports = router;
