const FETCH_COUNT = 10;

const searchLocationQuery = `SELECT id FROM LOCATIONS WHERE name = ?`;
const insertLocationQuery = `INSERT INTO LOCATIONS(name) VALUES(?)`;
const insertUserHasOneLocationQuery = `INSERT INTO USERS(username, location_1_id) VALUES(?, ?)`;
const insertUserHasTwoLocationQuery = `INSERT INTO USERS(username, location_1_id, location_2_id) VALUES(?, ?, ?)`;
const existsUserQuery = `SELECT IF(EXISTS(SELECT * FROM users WHERE username = ?),1,0) AS result`;
const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
const selectLocationNameQuery = `SELECT name FROM LOCATIONS WHERE id = ?`;
const locationIdQuery = `SELECT id FROM LOCATIONS WHERE NAME = ?`;
const insertProductQuery = `INSERT INTO PRODUCTS(title, content, user_id, category_id, image_url, price, location_id) VALUES(?, ?, ?, ?, ?, ?, ?)`;
const deleteLikeQuery = `DELETE FROM USER_LIKE_PRODUCT WHERE user_id=? AND product_id=?`;
const insertLikeQuery = `INSERT INTO USER_LIKE_PRODUCT(user_id, product_id) VALUES (?, ?)`;
const selectProductDetailQuery = (user) => {
  const user_id = user.userId;
  let returnQuery = `
  SELECT a.id, a.title, a.content, a.image_url, a.created_at, a.price, b.name AS location, IF(COUNT(c.user_id)>0, true, false) AS user_like, IF(a.user_id=${user_id}, true, false) AS authorized
  FROM PRODUCTS AS a INNER JOIN LOCATIONS AS b ON a.location_id = b.id LEFT JOIN USER_LIKE_PRODUCT AS c ON c.product_id = a.id AND c.user_id = ${user_id} 
  WHERE a.id = ? GROUP BY a.id`;
  return returnQuery;
};
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
const selectMyProductQuery = () => {
  let returnQuery = whereLocation();
  returnQuery += ` WHERE a.user_id = ? GROUP BY a.id ORDER BY a.created_at DESC LIMIT ${FETCH_COUNT} OFFSET ?`;
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
  insertProductQuery,
  deleteLikeQuery,
  insertLikeQuery,
  selectProductDetailQuery,
  selectProductListQuery,
  selectCategoryItemsQuery,
  selectMyProductQuery,
};
