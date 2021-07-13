const mysql = require('mysql2');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const dbname = config[env].database;

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0rladlrtmd',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
  con.query(`CREATE DATABASE ${dbname}`, function (err, result) {
    if (err) throw err;
    console.log('Database created');
    process.exit();
  });
});

module.exports = con;
