const createError = require('http-errors');
const multer = require('multer');
const crypto = require('crypto');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const MIME_TYPE_MAP = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/svg+xml': 'svg',
    };
    let ext = '.' + MIME_TYPE_MAP[file.mimetype];
    const hash = crypto.randomBytes(18).toString('hex');
    cb(null, hash + Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.substring(0, 5) !== 'image') {
      return cb(createError(400, '지원하지 않는 파일 형식입니다.'));
    }
    if (/;+/.test(file.originalname)) {
      return cb(createError(400, "';'는 지원하지 않는 파일명 입니다."));
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
    image_url += file.filename ? `/images/${file.filename};` : `${file};`;
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
  parseImageUrlStringToArray,
};
