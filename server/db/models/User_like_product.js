module.exports = {
  tableName: 'User_like_product',
  attributes: {
    user_id: ['INTEGER', 'NOT NULL'],
    product_id: ['INTEGER', 'NOT NULL'],
  },
  associate: {
    user_id: {
      ref: 'Users',
      target: 'id',
    },
    product_id: {
      ref: 'Products',
      target: 'id',
    },
  },
};
