require("dotenv").config();
const connectDB = require("./server/config/database/mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.use(cors("*"));
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at port:${PORT}`);
});
