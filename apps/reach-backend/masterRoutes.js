const express = require('express');

const masterRouter = express.Router();

const userRoutes = require('./subRoutes/userRoutes');
const productRoutes = require('./subRoutes/productRoutes');
const paymentRoutes = require('./subRoutes/paymentRoutes.js');

module.exports = () => masterRouter
  .use('/users', userRoutes())
  .use('/products', productRoutes())
  .use('/payments', paymentRoutes())
  .get('/', (req, res) => {
    console.log("All routes are online!");
    res.status(200).send("Server is Up and Running!");
  }).all('*', (req, res) => {
    // eslint-disable-next-line no-undef
    console.log("Route Does not exist!");
    res.sendStatus(404);
  });
