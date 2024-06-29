require("dotenv").config();
const jwt = require("jsonwebtoken");
const { isUndefined, isEmpty } = require('lodash');

const { ACCESS_TOKEN_SECRET = "testaccesstoken", REFRESH_TOKEN_SECRET = "testrefreshtoken" } = process.env || {};

function verifyJWT(accessToken, refreshToken) {
  let userDetails = {};
  try {
    userDetails = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    return { ...userDetails, accessTokenActive: true };
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      userDetails = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      return { ...userDetails, isTokenRefreshed: true };
    }
  }
}

async function authenticateUser(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const refreshToken = req.headers["refresh-token"];

    if (isUndefined(accessToken) || isUndefined(refreshToken)) {
      return res.status(401).send({
        message: "Unauthorized"
      });
    }

    const tokenDetails =
      verifyJWT(accessToken, refreshToken);

    if (isEmpty(tokenDetails)) {
      throw Error("Unauthorized");
    }

    const { isTokenRefreshed = false, accessTokenActive = false } = tokenDetails;

    if (isTokenRefreshed) {
      const newAccessToken = generateJwt({ userId: tokenDetails?.userId, email: tokenDetails?.email }, ACCESS_TOKEN_SECRET, '1h');
      req["userDetails"] = {
        userId: tokenDetails?.userId,
        email: tokenDetails?.email
      };

      res.setHeader('authorization', 'Bearer ' + newAccessToken);
    } else if (!accessTokenActive) {
      res.setHeader('refresh-token', false);
    }

    req["userDetails"] = {
      userId: tokenDetails?.userId,
      email: tokenDetails?.email
    };
    next();
  } catch (err) {
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
