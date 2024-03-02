const express = require("express");
const app = express();
require("dotenv").config();

const userAuth = require("./routes/auth.route.js");

app.use(express.json());

app.use("/auth", userAuth);

//testing this branch
//testing this branch

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
