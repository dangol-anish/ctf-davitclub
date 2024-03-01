const mysqli = require("mysql");
const connection = mysqli.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ctf_davitclub",
});

module.exports = connection;
