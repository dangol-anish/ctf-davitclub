const mysqli = require("mysql");
require("dotenv").config();

const connection = mysqli.createConnection({
  host: "192.168.0.101",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = connection;
