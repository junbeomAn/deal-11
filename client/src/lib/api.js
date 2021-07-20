export default (url, method, headers = {}, body = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    for (let [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(new Error(xhr.status));
      } else {
        resolve(JSON.parse(xhr.response));
      }
    };
    xhr.send(JSON.stringify(body));
  });
};
