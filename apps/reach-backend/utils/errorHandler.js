const errorHandler = (req, res, err) => {
  const { code, message } = err || {};

  if (["INVALID_ARGUMENTS", "MISSING_ARGUMENTS"].includes(code)) {
    return res.status(400).send({ status: "fail", message, code });
  }

  if (code === "RESTRICTED_ACCESS") {
    return res.status(401).send({
      message,
      code,
      status: "fail"
    });
  }

  if (code === "UNAUTHORIZED_USER") {
    return res.status(401).send({
      message,
      code,
      status: "fail"
    });
  }

  return res.status(500).send({ status: "fail", message: err.message, code: "INTERNAL_SERVER_ERROR" });
}

module.exports = { errorHandler };