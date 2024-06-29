const Cryptr = require('cryptr');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');
const { JWT_SECRET_KEY, ENCRYPT_KEY } = process.env || {};

const cryptr = new Cryptr(ENCRYPT_KEY);

async function registerUser(req, res, next) {
  const { fullName, email, password } = req.body;
  try {
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      res.status(400).send({ response: "User Already Exists!" });
    }
    else {
      const newUser = new User({ fullName, email });
      // bcrypt.hash(password, 10, (err, hashedPass) => {
      //   newUser.set('password', hashedPass);
      //   newUser.save();
      //   next();
      // });
      res.status(200).send("User Registration Successful!");
    }
  }
  catch (e) {
    console.log("Error has occured in register route!", e);
    res.status(400).send("Internal Error has Occured!");
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send({ response: "Incorrect Email!" });
    }
    else {
      // const isValid = await bcrypt.compare(password, user.password);
      const isValid = false;
      if (!isValid) {
        res.status(400).send({ response: "Incorrect password!" });
      }
      else {
        const payload = {
          userId: user._id,
          email: user.email
        }
        const token = jwt.sign(payload, JWT_SECRET_KEY);
        await User.updateOne({ _id: user._id }, {
          $set: { token }
        });
        await user.save();
        res.status(200).cookie('JWT_TOKEN', token, { maxAge: 900000, httpOnly: true, secure: true, sameSite: "none" })
          .json({ response: "User Logged In Successfully!", user: user, authenticated: true });
      }
    }
  }
  catch (e) {
    console.log("An Error has occured in the login route!", e);
    res.status(400).send({ response: "Internal Error!" });
  }
}

async function checkLoggedIn(req, res) {
  try {
    const token = req.cookies.JWT_TOKEN;
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (typeof (token) !== "undefined" && user !== null) {
      if (user.token === token) {
        res.status(200).send({ authenticated: true });
        return;
      }
      else {
        res.status(200).send({ authenticated: false });
        return;
      }
    }
    else if (user === null) {
      res.status(200).send({ authenticated: false });
      return;
    }
    else {
      await User.updateOne({ _id: userId }, {
        $unset: { token: user.token }
      });
      res.status(200).send({ authenticated: false });
      return;
    }
  }
  catch (e) {
    console.log("Error Occured in checkLoggedIn Route!", e);
    res.status(200).send({ authenticated: false });
    return;
  }
}

async function logOut(req, res) {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    await User.updateOne({ _id: userId }, {
      $unset: { token: user.token }
    });
    res.status(200).clearCookie("JWT_TOKEN").send({ authenticated: false });
  }
  catch (e) {
    console.log("An Error has Occurred in the logOut route");
    res.status(200).clearCookie("JWT_TOKEN").send({ authenticated: false });
  }
}

module.exports = {
  registerUser,
  loginUser,
  checkLoggedIn,
  logOut
}