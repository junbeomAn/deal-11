const mysql = require('mysql2/promise');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const dbname = config[env].database;
const pool = mysql.createPool(config[env]);

module.exports = pool;
