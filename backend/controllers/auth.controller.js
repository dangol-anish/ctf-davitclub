const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../utils/dbConnection");

const signup = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;
    const pwdHash = bcryptjs.hashSync(userPassword, 10);

    const checkExistingEmailQuery = `SELECT user_email FROM users WHERE user_email=?`;

    connection.query(
      checkExistingEmailQuery,
      [userEmail],
      async (err, existingUser) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error while checking existing email." });
        }

        if (existingUser.length > 0) {
          return res.status(400).json({ error: "Email already exists." });
        }

        const insertUserQuery = `INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)`;

        connection.query(
          insertUserQuery,
          [userName, userEmail, pwdHash],
          (err, insertUserResult) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error while inserting data to database." });
            }

            console.log("Insert ID: " + insertUserResult.insertId);
            res.status(201).json({ message: "User created successfully." });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Please enter valid credentials." });
  }
};

module.exports = signup;
