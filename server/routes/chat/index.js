const express = require('express');
const createError = require('http-errors');

const pool = require('../../db/index.js');
const { runAsyncWrapper } = require('../utils.js');
const {
  insertMessageQuery,
  selectExistRoomQuery,
  selectChatRoomValidQuery,
  insertChatRoomQuery,
} = require('../query.js');

const router = express.Router();

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

module.exports = router;
