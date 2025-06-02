const { v4: uuidv4 } = require("uuid");

const getId = (prefix) => {
  const suffix = uuidv4();
  return `${prefix}-${suffix}`;
};

module.exports = { getId };
