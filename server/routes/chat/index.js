const express = require('express');
const createError = require('http-errors');

const pool = require('../../db/index.js');
const { runAsyncWrapper, requiredLoginDecorator } = require('../utils.js');
const { getProductsWithImageUrlArray } = require('../product/image.js');
const {
  selectChatAuthorized,
  insertMessageQuery,
  selectExistRoomQuery,
  selectChatRoomValidQuery,
  insertChatRoomQuery,
  deleteChatRoomQuery,
  selectChatRoomAllQuery,
  selectChatRoomDetailQuery,
  selectProductForChatQuery,
  updateReadMessageQuery,
} = require('../query.js');

const router = express.Router();

router.get(
  '/',
  runAsyncWrapper(async (req, res, next) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const myinfo = await requiredLoginDecorator(req, next);
      const { id } = myinfo;
      const [result] = await connection.query(selectChatRoomAllQuery(id));
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
    try {
      const myinfo = await requiredLoginDecorator(req, next);
      const { id } = myinfo;
      const { toId, productId } = req.params;
      if (id == toId)
        next(createError(400, '본인에게 채팅을 하실 수 없습니다.'));
      const [check] = await pool.execute(
        selectExistRoomQuery(productId, id, toId)
      );
      if (check[0].exist === 0) {
        const [res] = await pool.execute(selectChatRoomValidQuery, [
          id,
          productId,
          toId,
          productId,
        ]);
        if (res[0].isSeller || !res[0].sellerHas) {
          next(createError(401, '채팅방을 개설하실 수 없습니다.'));
        } else {
          await pool.execute(insertChatRoomQuery, [productId, toId, id]);
          next();
        }
      } else {
        next();
      }
    } catch (err) {
      next(createError(+err.message));
    }
  }),
  runAsyncWrapper(async (req, res, next) => {
    const myinfo = await requiredLoginDecorator(req, next);
    const { content } = req.body;
    const { id } = myinfo;
    const { toId, productId } = req.params;
    await pool.execute(insertMessageQuery(productId, id, toId, content));
    res.send({ ok: true });
  })
);
router.get(
  '/:roomId',
  runAsyncWrapper(async (req, res, next) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const myinfo = await requiredLoginDecorator(req, next);
      const { id } = myinfo;
      const { roomId } = req.params;
      const [check] = await connection.query(selectChatAuthorized(roomId, id));
      if (check[0].authorized) {
        await connection.query(updateReadMessageQuery(roomId, id));
        const [messages] = await connection.query(
          selectChatRoomDetailQuery(id, roomId)
        );
        const [prevProduct] = await connection.query(
          selectProductForChatQuery(roomId)
        );
        const product = getProductsWithImageUrlArray(prevProduct);
        res.send({ ok: true, messages, product });
      } else {
        next(createError(401, '권한 없음'));
      }
    } catch (err) {
      console.log(err);
      next(createError(500, err.message));
    } finally {
      connection.release();
    }
  })
);
router.delete(
  '/:roomId',
  runAsyncWrapper(async (req, res, next) => {
    try {
      const myinfo = await requiredLoginDecorator(req, next);
      const { roomId } = req.params;
      const { id } = myinfo;
      const [check] = await pool.execute(selectChatAuthorized(roomId, id));
      console.log(check);
      if (check[0].authorized) {
        await pool.execute(deleteChatRoomQuery, [roomId]);
        res.send({ ok: true });
      } else {
        next(createError(401, '삭제 권한 없음'));
      }
    } catch (err) {
      next(createError(+err.message));
    }
  })
);

module.exports = router;
