module.exports = {
  development: {
    host: 'localhost',
    user: 'root',
    database: 'deal_development',
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
};
