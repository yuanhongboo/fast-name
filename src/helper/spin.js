const ora = require("ora");

exports.createSpinner = (msg) => {
  return ora(msg).start();
};
