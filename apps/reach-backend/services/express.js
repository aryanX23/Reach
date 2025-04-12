const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { authenticateUser } = require('../middlewares/authenticateUser');
const { ORIGIN_URL = 'http://localhost:3000' } = process.env || {};

const masterRoute = require('../masterRoutes');

module.exports = () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: [ORIGIN_URL],
      exposedHeaders: ['authorization', 'refresh-token'],
    }),
  );

  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Middleware to authenticate Customer

  app.use(async (req, res, next) => {

    const unVerifiedRoutes = req.path.includes('/users/login') ||
      req.path.includes('/users/register');

    if (unVerifiedRoutes) {
      return next();
    }
    await authenticateUser(req, res, next);
  });

  app.use('/api', masterRoute());

  return app;
};
