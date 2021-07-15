module.exports = {
  tableName: 'Users',
  attributes: {
    username: ['VARCHAR(20)', 'NOT NULL', 'UNIQUE'],
    location: ['VARCHAR(100)', 'NOT NULL'],
  },
};
