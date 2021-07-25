exports.getFirstName = (name) => {
  if (!name || !name.length) {
    throw Error("name is null or empty!");
  }
  return name.substr(0, 1);
};

exports.getLastName = (name) => {
  if (!name || !name.length) {
    throw Error("name is null or empty!");
  }
  return name.substr(1, name.length - 1);
};
