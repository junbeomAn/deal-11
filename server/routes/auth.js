const express = require('express');
const router = express.Router();

/* GET users listing. */
// router.post('/signin', function(req, res, next) {
//   const { username } = req.body;
//   User.findOne({
//     where: { username }
//   })
//   .then(user => {
//     if (user.length) {
//       req.session.isLogin = true;
//       res.json({ message: "로그인이 완료되었습니다. "});
//     } else {
//       res.status(401).json({message: "로그인 실패"});
//     }
//   })
//   .catch(err => {
//     res.status(500).json({message: "server error"});
//   });
// });

// router.post('/signup', function(req, res, next) {
//   const { username, location_one, location_two } = req.body;
//   User.findOne({
//     where: { username }
//   })
//   .then(user => {
//     if (!user.length) {
//       const userObj = {
//         username,
//         location_one
//       };
//       if (location_two) userObj.location_two = location_two;
//       User.create(userObj)
//       .then(user => {
        
//       })
//     } 
//   })
// });

module.exports = router;
