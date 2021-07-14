module.exports = {
  tableName: 'Products',
  attributes: {
    title: ['VARCHAR(200)', 'NOT NULL'],
    content: ['TEXT', 'NOT NULL'],
    created_at: ['DATETIME', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
    user_id: ['INTEGER', 'NOT NULL'],
    category_id: ['INTEGER', 'NOT NULL'],
    image_url: ['TEXT'],
    location_one: ['VARCHAR(100)'],
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
  },
};
