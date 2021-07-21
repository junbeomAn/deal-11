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
  } else {
    const priceArr = strPrice.split('').reverse();
    const withComma = priceArr.reduce((prev, current, idx, array) => {
      let now = current + prev;
      if (idx % 3 === 2 && idx !== array.length - 1) now = ',' + now;
      return now;
    }, '');
    return withComma + '원';
  }
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
export { isClass, isPromise, BASE_URL, combineWithQueryString, priceChange };
