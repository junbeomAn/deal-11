const mysql = require('mysql2/promise');
const config = require('./config');
const dotenv = require('dotenv');

const basicQuery = 'INSERT INTO CATEGORIES(name) values';
const categoryData = [
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '게임/취미',
  '생활/가공식품',
  '스포츠/레저',
  '여성패션/잡화',
  '남성패션/잡화',
  '유아동',
  '뷰티/미용',
  '반려동물',
  '도서/티켓/음반',
  '식물',
  '기타 중고물품',
];
let executeQuery = categoryData.reduce((query, category) => {
  return `${query} (\'${category}\'),`;
}, basicQuery);
executeQuery = executeQuery.substring(0, executeQuery.length - 1) + ';';
const env = process.env.NODE_ENV || 'development';

dotenv.config();
const pool = mysql.createPool({
  ...config[env],
  password: process.env.DB_PASSWORD,
});
console.log(executeQuery);
(async () => {
  try {
    await pool.execute(executeQuery);
    console.log('CATEGORY DATA SAVED!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
})();
