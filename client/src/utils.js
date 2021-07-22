function isClass(value) {
  return value.toString().startsWith('class ');
}

function isPromise(value) {
  return value instanceof Promise;
}

function priceChange(price) {
  let strPrice = String(price);
  if (strPrice === '-1') {
    return '가격 문의 주세요.';
  } else if (
    (isNaN(parseInt(strPrice)) || parseInt(strPrice) < -1) &&
    strPrice.length
  ) {
    return '올바른 가격이 아닙니다.';
  } else {
    const priceArr = strPrice.split('').reverse();
    const numberArr = priceArr.filter((char) => {
      if (isNaN(parseInt(char))) {
        return false;
      } else {
        return true;
      }
    });
    if (numberArr.length === 0) return '';
    const withComma = numberArr.reduce((prev, current, idx, array) => {
      let now = current + prev;
      if (idx % 3 === 2 && idx !== array.length - 1) now = ',' + now;
      return now;
    }, '');
    return withComma + '원';
  }
}

function getPriceOriginal(text) {
  const textArr = text.split('');
  const numberArr = textArr.filter((char) => {
    if (isNaN(parseInt(char))) {
      return false;
    } else {
      return true;
    }
  });
  return numberArr.join('');
}

const BASE_URL = 'http://localhost:3000/api/v1';
const AUTH_URL = 'http://localhost:3000';

const combineWithQueryString = (url, qs) => {
  // let ret = url + '/?';
  // Object.keys(qs).forEach((key) => {
  //   ret += key + '=' + qs[key];
  // });
  return url + '?' + new URLSearchParams(qs);
};

const categoryInfo = [
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '게임/취미',
  '생활/가공식품',
  '스포츠/레저',
  '여성패션/잡화',
  '남성패션/잡화',
  '유아동',
  '뷰티/미용',
  '반려동물',
  '도서/티켓/음반',
  '식물',
  '기타 중고물품',
];
export {
  isClass,
  isPromise,
  BASE_URL,
  combineWithQueryString,
  priceChange,
  getPriceOriginal,
  categoryInfo,
};
