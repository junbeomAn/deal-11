const mysql = require('mysql2/promise');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const dbname = config[env].database;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0rladlrtmd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .query(`CREATE DATABASE ${dbname}`)
  .then((_) => {
    console.log('DB Created!');
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    process.exit();
  });
