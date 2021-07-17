module.exports = {
  tableName: 'Products',
  attributes: {
    title: ['VARCHAR(200)', 'NOT NULL'],
    content: ['TEXT', 'NOT NULL'],
    created_at: ['DATETIME', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
    user_id: ['INTEGER', 'NOT NULL'],
    category_id: ['INTEGER', 'NOT NULL'],
    price: ['INTEGER'],
    image_url: ['TEXT'],
    price: ['INTEGER', 'NOT NULL'],
    location_id: ['INTEGER', 'NOT NULL'],
  },
  associate: {
    user_id: {
      ref: 'Users',
      target: 'id',
    },
    category_id: {
      ref: 'Categories',
      target: 'id',
    },
    location_id: {
      ref: 'Locations',
      target: 'id',
    },
  },
};
