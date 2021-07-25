const request = require("request");
const { debug } = require("./debug");

exports.post = (url, formData, headers) => {
  return new Promise((resolve, reject) => {
    debug(url, formData, headers);
    request.post({ url, formData, headers }, (err, resp, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
};

exports.get = (url, headers) => {
  return new Promise((resolve, reject) => {
    debug(url, headers);
    request.get({ url, headers }, (err, resp, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
};
