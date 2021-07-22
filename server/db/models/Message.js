module.exports = {
  tableName: 'MESSAGES',
  attributes: {
    chat_id: ['INTEGER', 'NOT NULL'],
    sender_id: ['INTEGER', 'NOT NULL'],
    content: ['TEXT', 'NOT NULL'],
    read: ['BOOLEAN', 'NOT NULL', 'DEFAULT', '0'],
    created_at: ['DATETIME', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
  },
  associate: {
    chat_id: {
      ref: 'CHAT_ROOMS',
      target: 'id',
    },
    sender_id: {
      ref: 'USERS',
      target: 'id',
    },
  },
};
