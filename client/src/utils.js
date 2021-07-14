function isClass(value) {
  return value.toString().startsWith('class ');
}

function isPromise(value) {
  return value instanceof Promise;
}
export { isClass, isPromise };
