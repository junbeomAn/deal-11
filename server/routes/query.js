const FETCH_COUNT = 10;

const searchLocationQuery = `SELECT id FROM LOCATIONS WHERE name = ?`;
const insertLocationQuery = `INSERT INTO LOCATIONS(name) VALUES(?)`;
const insertUserHasOneLocationQuery = `INSERT INTO USERS(username, location_1_id) VALUES(?, ?)`;
const insertUserHasTwoLocationQuery = `INSERT INTO USERS(username, location_1_id, location_2_id) VALUES(?, ?, ?)`;
const existsUserQuery = `SELECT IF(EXISTS(SELECT * FROM users WHERE username = ?),1,0) AS result`;
const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
const selectLocationNameQuery = `SELECT name FROM LOCATIONS WHERE id = ?`;
const locationIdQuery = `SELECT id FROM LOCATIONS WHERE NAME = ?`;
const whereLocation = (location) => {
  let returnQuery = `SELECT a.id, a.title, a.created_at, a.image_url, a.price, b.name AS location, COUNT(c.product_id) AS like_count FROM PRODUCTS AS a INNER JOIN LOCATIONS AS b ON a.location_id=b.id`;
  returnQuery += ` LEFT JOIN USER_LIKE_PRODUCT AS c ON c.product_id=a.id`;
  if (location) returnQuery += ` WHERE b.name = '${location}'`;
  return returnQuery;
};
const selectProductListQuery = (location) => {
  let returnQuery = whereLocation(location);
  returnQuery += ` GROUP BY a.id ORDER BY a.created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`;
  return returnQuery;
};
const selectCategoryItemsQuery = (location, category_id) => {
  let returnQuery = whereLocation(location);
  if (location) returnQuery += ` AND`;
  else returnQuery += ` WHERE`;
  returnQuery += ` a.category_id = ${category_id}`;
  returnQuery += ` GROUP BY a.id ORDER BY a.created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`;
  return returnQuery;
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
  selectCategoryItemsQuery,
};
