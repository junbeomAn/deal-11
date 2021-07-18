module.exports = {
  tableName: 'Chat_rooms',
  attributes: {
    seller_id: ['INTEGER', 'NOT NULL'],
    buyer_id: ['INTEGER', 'NOT NULL'],
    product_id: ['INTEGER', 'NOT NULL'],
  },
  associate: {
    seller_id: {
      ref: 'Users',
      target: 'id',
    },
    buyer_id: {
      ref: 'Users',
      target: 'id',
    },
    product_id: {
      ref: 'Products',
      target: 'id',
    },
  },
};
