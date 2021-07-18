module.exports = {
  tableName: 'Messages',
  attributes: {
    chat_id: ['INTEGER', 'NOT NULL'],
    sender_id: ['INTEGER', 'NOT NULL'],
    content: ['TEXT', 'NOT NULL'],
    read: ['BOOLEAN', 'NOT NULL', 'DEFAULT', '0'],
  },
  associate: {
    chat_id: {
      ref: 'Chat_rooms',
      target: 'id',
    },
    sender_id: {
      ref: 'Users',
      target: 'id',
    },
  },
};
