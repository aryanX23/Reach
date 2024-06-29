const Cryptr = require('cryptr');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');

const { User } = require('../../models');
const { errorHandler } = require('../../utils/errorHandler');
const { getId } = require('../../utils/generateId');
const { ENCRYPT_KEY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env || {};

const cryptr = new Cryptr(ENCRYPT_KEY);

async function registerUser(req, res, next) {
  const { name = '', email = '', password = '' } = req.body;
  try {
    if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
      throw {
        code: "MISSING_ARGUMENTS",
        message: "Either the name, email or password is/are missing!"
      }
    }

    const userDetails = await User.findOne({ email }).lean() || {};
    if (!isEmpty(userDetails)) {
      throw {
        code: "INVALID_ARGUMENTS",
        message: "User Already Exists!"
      }
    }
    const userId = getId("USER");
    const newUserPayload = { userId, name, email, password: cryptr.encrypt(password) };
    await User.create(newUserPayload);

    res.status(200).send({ status: "success", message: "User Registered Successfully" });
  }
  catch (e) {
    console.log("Error has occured in register route: ", e?.stack || e?.message || e);
    errorHandler(req, res, e);
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    if (isEmpty(email) || isEmpty(password)) {
      throw {
        code: "MISSING_ARGUMENTS",
        message: "Either the email or password is/are missing!"
      }
    }

    const userDetails = await User.findOne({ email }).lean() || {};
    if (isEmpty(userDetails)) {
      throw {
        code: "INVALID_ARGUMENTS",
        message: "User Does Not Exists!"
      }
    }

    const { userId = '', password: userPassword = '', name = '' } = userDetails;

    const decryptedPassword = cryptr.decrypt(userPassword);

    if (decryptedPassword !== password) {
      throw {
        code: "INVALID_ARGUMENTS",
        message: "Incorrect Password"
      }
    }

    const payload = {
      userId,
      email,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);

    return res.status(200).send({ ACCESS_TOKEN: accessToken, REFRESH_TOKEN: refreshToken, userId, name, status: "success" });
  }
  catch (e) {
    console.log("An Error has occured in the login route: ", e);
    errorHandler(req, res, e);
  }
}

module.exports = {
  registerUser,
  loginUser,
}