function isClass(value) {
  return value.toString().startsWith('class ');
}

function isPromise(value) {
  return value instanceof Promise;
}

const BASE_URL = 'http://localhost:3000';

const combineWithQueryString = (url, qs) => {
  return url + new URLSearchParams(qs);
};
export { isClass, isPromise, BASE_URL, combineWithQueryString };
