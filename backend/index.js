const express = require("express");
const app = express();
require("dotenv").config();

const userAuth = require("./routes/auth.route.js");
const userDashboard = require("../backend/routes/dashboard.route.js");

app.use(express.json());

app.use("/auth", userAuth);
app.use("/dashboard", userDashboard);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
