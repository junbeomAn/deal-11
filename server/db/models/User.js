module.exports = {
  tableName: 'USERS',
  attributes: {
    username: ['VARCHAR(20)', 'NOT NULL', 'UNIQUE'],
    location_1_id: ['INTEGER', 'NOT NULL'],
    location_2_id: ['INTEGER'],
  },
  associate: {
    location_1_id: {
      ref: 'LOCATIONS',
      target: 'id',
    },
    location_2_id: {
      ref: 'LOCATIONS',
      target: 'id',
    },
  },
};
