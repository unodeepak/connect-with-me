require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
