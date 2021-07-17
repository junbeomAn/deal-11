const pool = require('../db/index.js');
const { searchLocationQuery, insertLocationQuery } = require('./query.js');
const test = `INSERT INTO LOCATIONS `;

const selectOrInsertLocation = async (name) => {
  const [location] = await pool.execute(searchLocationQuery, [name]);
  if (!location.length) {
    const result = await pool.execute(insertLocationQuery, [name]);
    return result[0].insertId;
  }
  return location[0].id;
};

module.exports = {
  selectOrInsertLocation,
};
