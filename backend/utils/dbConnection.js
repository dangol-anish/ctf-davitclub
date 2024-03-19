const mysqli = require("mysql");
require("dotenv").config();

const connection = mysqli.createConnection({
  host: process.env.IP,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = connection;
