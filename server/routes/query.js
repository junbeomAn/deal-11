const FETCH_COUNT = 10;

const searchLocationQuery = `SELECT id FROM LOCATIONS WHERE name = ?`;
const insertLocationQuery = `INSERT INTO LOCATIONS(name) VALUES(?)`;
const insertUserHasOneLocationQuery = `INSERT INTO USERS(username, location_1_id) VALUES(?, ?)`;
const insertUserHasTwoLocationQuery = `INSERT INTO USERS(username, location_1_id, location_2_id) VALUES(?, ?, ?)`;
const existsUserQuery = `SELECT IF(EXISTS(SELECT * FROM users WHERE username = ?),1,0) AS result`;
const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
const selectLocationNameQuery = `SELECT name FROM LOCATIONS WHERE id = ?`;
const locationIdQuery = `SELECT id FROM LOCATIONS WHERE NAME = ?`;
const selectProductListQuery = (location) => {
  let returnQuery;
  if (location) {
    const locationIdSubQuery = `SELECT id FROM LOCATIONS WHERE name = '${location}' LIMIT 1`;
    const locationNameSubQuery = `SELECT name FROM LOCATIONS WHERE name = '${location}' LIMIT 1`;

    returnQuery = `SELECT id, title, created_at, (${locationNameSubQuery})AS 'location', image_url, price FROM PRODUCTS`;
    returnQuery += ` WHERE location_id = (${locationIdSubQuery})`;
  } else {
    returnQuery = `SELECT a.id, a.title, a.created_at, a.image_url, a.price, b.name AS location FROM PRODUCTS AS a INNER JOIN LOCATIONS AS b ON (a.location_id=b.id)`;
  }
  return (
    returnQuery + ` ORDER BY created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`
  );
};

module.exports = {
  searchLocationQuery,
  insertLocationQuery,
  insertUserHasOneLocationQuery,
  insertUserHasTwoLocationQuery,
  existsUserQuery,
  selectUserQuery,
  selectLocationNameQuery,
  locationIdQuery,
  selectProductListQuery,
};
