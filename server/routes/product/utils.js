const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const makeImageUrlString = (files) => {
  let image_url = '';

  files.forEach((file) => {
    image_url += `/images/${file.originalname};`;
  });
  return image_url;
};

const parseImageUrlStringToArray = (str) => {
  const imageUrls = str.split(';');
  imageUrls.pop();
  return imageUrls;
};

const getProductsWithImageUrlArray = (products) => {
  return products.map((product) => {
    return {
      ...product,
      image_url: parseImageUrlStringToArray(product.image_url),
    };
  });
};

module.exports = {
  upload,
  makeImageUrlString,
  getProductsWithImageUrlArray,
};
