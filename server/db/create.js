const mysql = require('mysql2/promise');
const config = require('./config');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const dbname = config[env].database;

dotenv.config();
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
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
