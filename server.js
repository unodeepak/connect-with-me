require("dotenv").config();
const connectDB = require("./server/config/database/mongoose");
const express = require("express");
const cors = require("cors");
const routes = require("./server/routes");
const initData = require("./server/config/initData/initData.js");

const app = express();
const PORT = process.env.PORT;

app.use(cors("*"));
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, async () => {
  await connectDB();

  // initData();
  
  console.log(`Server running at port:${PORT}`);
});
