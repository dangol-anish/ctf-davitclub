// // require("dotenv").config();
// // const connection = require("../utils/dbConnection");

// // const connectSocket = (req, res) => {
// //   connection.query(
// //     "SELECT * FROM users ORDER BY user_score DESC",
// //     (err, results) => {
// //       if (err) {
// //         console.error("Error fetching players:", err);
// //         res.status(500).send("Internal Server Error");
// //         return;
// //       }

// //       res.json(results);
// //     }
// //   );
// // };

// // const add = (req, res) => {
// //   const { name, score } = req.body;

// //   connection.query(
// //     "INSERT INTO users (user_name, user_score) VALUES (?, ?)",
// //     [name, score],
// //     (err) => {
// //       if (err) {
// //         console.error("Error adding player:", err);
// //         res.status(500).send("Internal Server Error");
// //         return;
// //       }

// //       res.status(201).send("Player added successfully");
// //     }
// //   );
// // };

// // module.exports = { connectSocket, add };

// const http = require("http").createServer();
// const io = require("socket.io")(http, {
//   cors: { origin: "*" },
// });
// const express = require("express");
// const app = express();

// const connection = require("../utils/dbConnection");

// const currentScoreQuery =
//   "select user_name, user_score from users order by user_score desc limit 10";

// connection.query(currentScoreQuery, (err, result) => {
//   if (err) throw err;
//   console.log(result);

//   res.json(result);

//   io.on("connection", (socket) => {
//     socket.on("scoreUpdate", (result) => {
//       console.log(result);
//       io.emit("scoreUpdate", `${socket.id.substr(0, 2)} said ${result}`);
//     });
//   });
// });

// http.listen(8080, () => console.log("listening on 192.168.0.101:8080"));

const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const express = require("express");
const app = express();

const connection = require("../utils/dbConnection");

// Move io.on('connection', ...) outside the function to ensure it's only added once
io.on("connection", (socket) => {
  console.log("A user connected");
});

const scoreUpdate = async (req, res) => {
  try {
    const currentScoreQuery =
      "select user_name, user_score from users order by user_score desc limit 10";

    connection.query(currentScoreQuery, (err, result) => {
      if (err) throw err;
      console.log(result);

      res.json(result);

      // Emit scoreUpdate event when data is fetched from the database
      io.emit("scoreUpdate", result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

http.listen(8080, () => console.log("listening on 192.168.0.101:8080"));

module.exports = { scoreUpdate };
