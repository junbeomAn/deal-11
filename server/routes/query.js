const searchLocationQuery = `SELECT id FROM LOCATIONS WHERE name = ?`;
const insertLocationQuery = `INSERT INTO LOCATIONS(name) VALUES(?)`;
const insertUserHasOneLocationQuery = `INSERT INTO USERS(username, location_1_id) VALUES(?, ?)`;
const insertUserHasTwoLocationQuery = `INSERT INTO USERS(username, location_1_id, location_2_id) VALUES(?, ?, ?)`;
const existsUserQuery = `SELECT IF(EXISTS(SELECT * FROM users WHERE username = ?),1,0) AS result`;
const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
const selectLocationNameQuery = `SELECT name FROM LOCATIONS WHERE id = ?`;

module.exports = {
  searchLocationQuery,
  insertLocationQuery,
  insertUserHasOneLocationQuery,
  insertUserHasTwoLocationQuery,
  existsUserQuery,
  selectUserQuery,
  selectLocationNameQuery,
};
