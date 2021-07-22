module.exports = {
  tableName: 'USER_LIKE_PRODUCT',
  attributes: {
    user_id: ['INTEGER', 'NOT NULL'],
    product_id: ['INTEGER', 'NOT NULL'],
  },
  associate: {
    user_id: {
      ref: 'USERS',
      target: 'id',
    },
    product_id: {
      ref: 'PRODUCTS',
      target: 'id',
    },
  },
};
