// const express = require("express");
// const app = express();
// require("dotenv").config();
// const connection = require("./utils/dbConnection.js");
// const cors = require("cors");

// // for test
// const http = require("http");
// const socketIo = require("socket.io");

// const userAuth = require("./routes/auth.route.js");
// const userDashboard = require("../backend/routes/dashboard.route.js");
// const userScoreboard = require("../backend/routes/scoreboard.route.js");

// app.use(express.json());
// app.use(cors());

// app.use("/auth", userAuth);
// app.use("/dashboard", userDashboard);
// app.use("/scoreboard", userScoreboard);

// app.listen(process.env.SERVER_PORT, () => {
//   console.log(`Server running on port ${process.env.SERVER_PORT}`);
// });

// // http.listen(8888, () => console.log("listening on http://192.168.0.101:8888"));

const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const express = require("express");
const app = express();

const connection = require("./utils/dbConnection");

// Move io.on('connection', ...) outside the function to ensure it's only added once
io.on("connection", (socket) => {
  console.log("A user connected");
  scoreUpdate();
});

const scoreUpdate = async () => {
  try {
    const currentScoreQuery =
      "select user_name, user_score from users order by user_score desc limit 10";

    connection.query(currentScoreQuery, (err, result) => {
      if (err) {
        console.log("Error fetching scores:", err);
        return;
      }

      // console.log("Scores fetched 1:", result);

      const results = Object.values(JSON.parse(JSON.stringify(result)));

      // Emit scoreUpdate event when data is fetched from the database
      io.emit("scoreUpdate", results);
    });
  } catch (err) {
    console.log("Error in scoreUpdate function:", err);
  }
};

// Route handler for the /scoreboard endpoint
app.get("/scoreboard", (req, res) => {
  // Call scoreUpdate function to fetch data and send it as an HTTP response
  const currentScoreQuery =
    "select user_name, user_score from users order by user_score desc limit 10";

  connection.query(currentScoreQuery, (err, result) => {
    if (err) {
      console.log("Error fetching scores:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Scores fetched 2:", result.user_name);
    res.json(result);
  });
});

http.listen(8080, () => console.log("listening on 192.168.0.101:8080"));

module.exports = { scoreUpdate };
