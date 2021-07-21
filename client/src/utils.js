function isClass(value) {
  return value.toString().startsWith('class ');
}

function isPromise(value) {
  return value instanceof Promise;
}

const BASE_URL = 'http://localhost:3000/api/v1';

const combineWithQueryString = (url, qs) => {
  // let ret = url + '/?';
  // Object.keys(qs).forEach((key) => {
  //   ret += key + '=' + qs[key];
  // });
  return url + '/?' + new URLSearchParams(qs);
};
export { isClass, isPromise, BASE_URL, combineWithQueryString };
