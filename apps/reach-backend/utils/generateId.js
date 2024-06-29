const { v4 : uuidv4 } = require('uuid');

const getId = (prefix) => {
  try {
    const suffix = uuidv4();
    return `${prefix}-${suffix}`;
  } catch (err) {
    throw err;
  }
};

module.exports = { getId };