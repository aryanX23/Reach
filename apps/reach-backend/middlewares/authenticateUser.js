require('dotenv').config();
const jwt = require('jsonwebtoken');
const { isUndefined, isEmpty } = require('lodash');

const { ACCESS_TOKEN_SECRET = 'testaccesstoken', REFRESH_TOKEN_SECRET = 'testrefreshtoken' } = process.env || {};

function verifyJWT(accessToken, refreshToken) {
  let userDetails = {};
  try {
    userDetails = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    return { ...userDetails, refreshTokenExpired: false };
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      try {
        userDetails = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        return { ...userDetails, isTokenRefreshed: true, refreshTokenExpired: false };
      } catch (err) {
        console.warn(err);
        return { refreshTokenExpired: true };
      }
    }
    return {};
  }
}

async function authenticateUser(req, res, next) {
  try {
    const accessToken = req.headers?.authorization?.split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (isUndefined(accessToken) || isUndefined(refreshToken)) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    const tokenDetails = verifyJWT(accessToken, refreshToken);

    if (isEmpty(tokenDetails)) {
      throw Error('Unauthorized');
    }

    const { isTokenRefreshed = false, refreshTokenExpired = false } = tokenDetails;

    if (isTokenRefreshed) {
      const newAccessToken = generateJwt({ userId: tokenDetails?.userId, email: tokenDetails?.email }, ACCESS_TOKEN_SECRET, '1H');
      req['userDetails'] = {
        userId: tokenDetails?.userId,
        email: tokenDetails?.email,
      };

      res.setHeader('authorization', 'Bearer ' + newAccessToken);
    } else if (refreshTokenExpired) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    req['userDetails'] = {
      userId: tokenDetails?.userId,
      email: tokenDetails?.email,
    };
    next();
  } catch (err) {
    console.log('Error has occured in the authenticateUser middleware: ', err);
    return res.status(401).send({
      message: 'Unauthorized',
    });
  }
}

const generateJwt = (tokenDetails, secret, expiresIn) => {
  const token = jwt.sign(tokenDetails, secret, { expiresIn });
  return token;
};

module.exports = { authenticateUser };
