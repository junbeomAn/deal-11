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
const updateProductQuery = `UPDATE PRODUCTS SET title = ?, content = ?, image_url = ?, price = ?, location_id = ? WHERE id = ?`;
const deleteProductQuery = `DELETE FROM PRODUCTS WHERE id = ?`;
const selectIsAuthorized = `SELECT IF(user_id = ?, 1, 0) AS authorized, image_url FROM PRODUCTS WHERE id = ?`;
const selectChatRoomValidQuery = `SELECT IF(EXISTS(SELECT id FROM PRODUCTS WHERE user_id = ? AND id = ?), 1, 0) AS isSeller, IF(EXISTS(SELECT id FROM PRODUCTS WHERE user_id = ? AND id = ?), 1, 0) AS sellerHas`;
const insertChatRoomQuery = `INSERT INTO CHAT_ROOMS(product_id, seller_id, buyer_id) VALUES (?, ?, ?)`;
const deleteChatRoomQuery = `DELETE FROM CHAT_ROOMS WHERE id = ?`;
const updateReadMessageQuery = (roomId, userId) => {
  return `
    UPDATE MESSAGES SET MESSAGES.read = 1 WHERE chat_id = ${roomId} AND NOT sender_id = ${userId}
  `;
};
const selectChatRoomAllQuery = (userId) => {
  return `
   SELECT room.id, 
   IF(room.seller_id = ${userId}, 
    (SELECT username FROM USERS WHERE id = room.buyer_id), 
    (SELECT username FROM USERS WHERE id = room.seller_id)
   ) AS sender,
   (SELECT image_url FROM PRODUCTS WHERE id = room.product_id) AS image_url,
   (SELECT COUNT(*) FROM MESSAGES WHERE chat_id = room.id AND 'read' = 0 AND NOT sender_id = ${userId}) AS unread, 
   (SELECT content FROM MESSAGES WHERE chat_id = room.id ORDER BY created_at DESC LIMIT 1) AS last_content,
   (SELECT created_at FROM MESSAGES WHERE chat_id = room.id ORDER BY created_at DESC LIMIT 1) AS last_date
   FROM CHAT_ROOMS AS room 
   WHERE ${userId} IN (room.seller_id, room.buyer_id)
  `;
};
const selectProductForChatQuery = (roomId) => {
  return `
    SELECT product.id, product.image_url, product.title, product.price 
    FROM PRODUCTS AS product, CHAT_ROOMS AS room 
    WHERE room.id = ${roomId} AND room.product_id = product.id
  `;
};
const selectChatRoomDetailQuery = (userId, roomId) => {
  return `
    SELECT content, MESSAGES.read,
    IF(sender_id = ${userId}, 0, sender_id) AS fromId 
    FROM MESSAGES 
    WHERE chat_id = ${roomId}
  `;
};
const selectChatAuthorized = (roomId, userId) => {
  return `SELECT IF(EXISTS(SELECT id FROM CHAT_ROOMS WHERE id = ${roomId} AND (seller_id = ${userId} OR buyer_id = ${userId})), 1, 0) AS authorized`;
};
const insertMessageQuery = (productId, userId, toId, content) => {
  const selectChatRoomQuery = `SELECT id FROM CHAT_ROOMS WHERE product_id = ${productId} AND ((seller_id = ${toId} AND buyer_id = ${userId}) OR (seller_id = ${userId} AND buyer_id = ${toId}))`;
  return `INSERT INTO MESSAGES(chat_id, sender_id, content) VALUES ((${selectChatRoomQuery}), ${userId}, '${content}')`;
};
const selectExistRoomQuery = (productId, userId, toId) => {
  return `SELECT COUNT(*) AS exist FROM CHAT_ROOMS WHERE product_id = ${productId} AND ((seller_id = ${userId} AND buyer_id = ${toId}) OR (buyer_id = ${userId} AND seller_id = ${toId}))`;
};
const selectProductDetailQuery = (user) => {
  const user_id = user.userId;
  let returnQuery = `
  SELECT a.id, a.title, a.content, e.username AS seller_name, e.id AS seller_id, a.image_url, a.created_at, a.price, b.name AS location, IF(COUNT(c.user_id)>0, true, false) AS user_like, IF(a.user_id=${user_id}, true, false) AS authorized
  , d.name AS category
  FROM PRODUCTS AS a INNER JOIN LOCATIONS AS b ON a.location_id = b.id INNER JOIN CATEGORIES AS d ON d.id = a.category_id INNER JOIN USERS AS e ON e.id = a.user_id 
  LEFT JOIN USER_LIKE_PRODUCT AS c ON c.product_id = a.id AND c.user_id = ${user_id} 
  WHERE a.id = ? GROUP BY a.id`;
  return returnQuery;
};
const whereLocation = (location) => {
  let returnQuery = `SELECT a.id, a.title, a.created_at, a.image_url, a.price, b.name AS location, COUNT(c.product_id) AS like_count, COUNT(CHAT_ROOMS.id) AS chat_count 
  FROM PRODUCTS AS a INNER JOIN LOCATIONS AS b ON a.location_id=b.id`;
  returnQuery += ` LEFT JOIN USER_LIKE_PRODUCT AS c ON c.product_id=a.id LEFT JOIN CHAT_ROOMS ON CHAT_ROOMS.product_id = a.id `;
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
  returnQuery += ` WHERE a.user_id = ? GROUP BY a.id ORDER BY a.created_at DESC`;
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
  selectIsAuthorized,
  updateProductQuery,
  deleteProductQuery,
  selectChatRoomValidQuery,
  insertChatRoomQuery,
  deleteChatRoomQuery,
  selectExistRoomQuery,
  selectProductDetailQuery,
  selectProductListQuery,
  selectCategoryItemsQuery,
  selectMyProductQuery,
  insertMessageQuery,
  selectChatAuthorized,
  selectChatRoomAllQuery,
  selectChatRoomDetailQuery,
  selectProductForChatQuery,
  updateReadMessageQuery,
};
