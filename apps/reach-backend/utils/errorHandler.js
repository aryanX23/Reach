const errorHandler = (req, res, err) => {
  const { code, message } = err || {};

  if (['INVALID_ARGUMENTS', 'MISSING_ARGUMENTS', 'FRIEND_REQUEST_ALREADY_SENT', 'USER_DOES_NOT_EXIST', 'FRIEND_ALREADY_ADDED'].includes(code)) {
    return res.status(400).send({ status: 'fail', message, code });
  }

  if (['RESTRICTED_ACCESS', 'UNAUTHORIZED_USER'].includes(code)) {
    return res.status(401).send({
      message,
      code,
      status: 'fail',
    });
  }

  return res.status(500).send({ status: 'fail', message: err.message, code: 'INTERNAL_SERVER_ERROR' });
};

module.exports = { errorHandler };