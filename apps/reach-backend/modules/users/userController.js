const Cryptr = require('cryptr');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');

const { User } = require('../../models');
const { getId, errorHandler } = require('../../utils');
const { ENCRYPT_KEY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env || {};

const cryptr = new Cryptr(ENCRYPT_KEY);

async function registerUser(req, res) {
  const { name = '', email = '', password = '' } = req.body;
  try {
    if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
      throw {
        code: 'MISSING_ARGUMENTS',
        message: 'Either the name, email or password is/are missing!',
      };
    }

    const userDetails = await User.findOne({ email }).lean() || {};
    if (!isEmpty(userDetails)) {
      throw {
        code: 'INVALID_ARGUMENTS',
        message: 'User Already Exists!',
      };
    }
    const userId = getId('USER');
    const newUserPayload = { userId, name, email, password: cryptr.encrypt(password) };
    await User.create(newUserPayload);

    res.status(200).send({ status: 'success', message: 'User Registered Successfully' });
  }
  catch (e) {
    console.log('Error has occured in register route: ', e?.stack || e?.message || e);
    errorHandler(req, res, e);
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    if (isEmpty(email) || isEmpty(password)) {
      throw {
        code: 'MISSING_ARGUMENTS',
        message: 'Either the email or password is/are missing!',
      };
    }

    const userDetails = await User.findOne({ email }).lean() || {};
    if (isEmpty(userDetails)) {
      throw {
        code: 'INVALID_ARGUMENTS',
        message: 'User Does Not Exists!',
      };
    }

    const { userId = '', password: userPassword = '', name = '' } = userDetails;

    const decryptedPassword = cryptr.decrypt(userPassword);

    if (decryptedPassword !== password) {
      throw {
        code: 'INVALID_ARGUMENTS',
        message: 'Incorrect Password',
      };
    }

    const payload = {
      userId,
      email,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1H' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '1D' });

    return res.status(200).send({ ACCESS_TOKEN: accessToken, REFRESH_TOKEN: refreshToken, userId, name, status: 'success' });
  }
  catch (e) {
    console.log('An Error has occured in the login route: ', e);
    errorHandler(req, res, e);
  }
}

const handleFriendRequest = async (req, res) => {
  const { id } = req.query;
  try {
    const userDetails = await User.findOne({ userId: id }).lean() || {};
    if (isEmpty(userDetails)) {
      throw {
        code: 'USER_DOES_NOT_EXIST',
        message: 'User Does Not Exists!',
      };
    }

    const { userId } = req.userDetails;
    const { friend_requests = [] } = userDetails || {};

    if (friend_requests.includes(userId)) {
      throw {
        code: 'FRIEND_REQUEST_ALREADY_SENT',
        message: 'Friend Request Already Sent!',
      };
    }
    await User.updateOne({ userId: id }, { $push: { friend_requests: userId } });

    res.status(200).send({ status: 'success', message: 'Friend Request Sent Successfully!' });
  }
  catch (e) {
    console.log('An Error has occured in the handleFriendRequest route: ', e);
    errorHandler(req, res, e);
  }
};

const getPendingFriendRequests = async (req, res) => {
  const { userId } = req.userDetails;
  try {
    const userDetails = await User.findOne({ userId }).lean() || {};
    if (isEmpty(userDetails)) {
      throw {
        code: 'USER_DOES_NOT_EXIST',
        message: 'User Does Not Exists!',
      };
    }
    const { friend_requests = [] } = userDetails || {};
    const pendingRequests = await User.find({ userId: { $in: friend_requests } }).lean() || [];
    res.status(200).send({ status: 'success', pendingRequests });
  }
  catch (e) {
    console.log('An Error has occured in the getPendingFriendRequests route: ', e);
    errorHandler(req, res, e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  handleFriendRequest,
  getPendingFriendRequests,
};