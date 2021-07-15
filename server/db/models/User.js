module.exports = {
  tableName: 'Users',
  attributes: {
    username: ['VARCHAR(20)', 'NOT NULL', 'UNIQUE'],
    location: ['TEXT', 'NOT NULL'],
  },
};
