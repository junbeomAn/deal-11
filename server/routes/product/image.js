const createError = require('http-errors');
const multer = require('multer');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.substring(0, 5) !== 'image') {
      cb(createError(400, '지원하지 않는 파일 형식입니다.'));
    }
    if (/;+/.test(file.originalname)) {
      cb(createError(400, "';'는 지원하지 않는 파일명 입니다."));
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
});

const makeImageUrlString = (files = []) => {
  let image_url = '';

  files.forEach((file) => {
    image_url += `/images/${file.filename};`;
  });
  return image_url;
};

const parseImageUrlStringToArray = (str) => {
  if (!str) return [];

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
