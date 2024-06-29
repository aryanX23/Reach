require('dotenv').config();
const express = require('express');

const { PORT = 8000 } = process.env || {};

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});