require("dotenv").config();

const connectMongoDb = require("./middlewares/mongoose");

const { PORT = 8000 } = process.env || {};
// Package Import and variable initializations

//Database Connection and Server Initialization
const db = connectMongoDb();

db.on('error', (err) => {
  console.log('Mongoose error', err);
});

db.once('open', async () => {
  const setupExpress = require('./configs/express');
  const app = setupExpress();

  app.set('port', PORT);
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
  });

  console.log(`Connected to DB!`);
});
