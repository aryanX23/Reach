const zodErrorFormatter = (error = {}) => {
  let finalResponse = {};
  const parsedErrors = JSON.parse(error.message || "{}");
  parsedErrors?.forEach((err) => {
    const errorObject = {
      [err.path[0]]: err.message,
    };

    finalResponse = { ...finalResponse, ...errorObject };
  });
  return finalResponse;
}

module.exports = {
  zodErrorFormatter,
};