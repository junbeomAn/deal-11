module.exports = {
  tableName: 'CHAT_ROOMS',
  attributes: {
    seller_id: ['INTEGER', 'NOT NULL'],
    buyer_id: ['INTEGER', 'NOT NULL'],
    product_id: ['INTEGER', 'NOT NULL'],
  },
  associate: {
    seller_id: {
      ref: 'USERS',
      target: 'id',
    },
    buyer_id: {
      ref: 'USERS',
      target: 'id',
    },
    product_id: {
      ref: 'PRODUCTS',
      target: 'id',
    },
  },
};
