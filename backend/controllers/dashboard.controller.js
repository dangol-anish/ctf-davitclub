require("dotenv").config();
const connection = require("../utils/dbConnection");

const sendQuestion = (req, res) => {
  const getAllQuestionsQuery = "select * from questions";

  connection.query(getAllQuestionsQuery, async (err, getAllQuestionResult) => {
    if (err) {
      return res.status(500).json({ error: "Error while fetching questions." });
    }
    return res.status(200).json(getAllQuestionResult);
  });
};

const checkAnswer = (req, res) => {
  const { questionId, userId, userAnswer } = req.body;
  console.log(req.body);

  const getAnswer =
    "select question_answer from questions where question_id = ?";

  connection.query(getAnswer, [questionId], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error checking answer" });
    }
  });
};

// const checkAnswer = (req, res) => {
//   const { questionId, userId, userAnswer } = req.body;

//   console.log(req.body);
//   const checkAnswerQuery =
//     "select question_points from questions where question_id=? and question_answer= ?";

//   connection.query(
//     checkAnswerQuery,
//     [questionId, userAnswer],
//     async (err, checkAnswerResult) => {
//       if (err) {
//         return res.status(500).json({ error: "Error checking answer" });
//       }
//       if (checkAnswerResult.length > 0) {
//         // if point increase user score
//         const getUserScoreQuery =
//           "select user_score from users where user_id=?";

//         connection.query(
//           getUserScoreQuery,
//           [userId],
//           async (err, getUserScoreResult) => {
//             if (err) {
//               return res
//                 .status(500)
//                 .json({ error: "Error getting user score" });
//             }
//             const userScoreValue =
//               getUserScoreResult[0].user_score +
//               checkAnswerResult[0].question_points;

//             const updateUserPointsQuery =
//               "update users set user_score=? where user_id=?";

//             connection.query(
//               updateUserPointsQuery,
//               [userScoreValue, userId],
//               async (err, getUserScoreResult) => {
//                 if (err) {
//                   return res
//                     .status(500)
//                     .json({ error: "Error getting user score" });
//                 }

//                 const insertSolvedUserQuery =
//                   "INSERT INTO solved_questions (question_id, user_id) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM solved_questions WHERE user_id = ?)";

//                 connection.query(
//                   insertSolvedUserQuery,
//                   [questionId, userId, userId],
//                   async (err, result) => {
//                     if (err) {
//                       return res
//                         .status(500)
//                         .json({ error: "Error inserting solved user data" });
//                     }
//                     // Check if any rows were affected by the insert
//                     if (result.affectedRows === 0) {
//                       // The user_id already exists in the table
//                       return res
//                         .status(400)
//                         .json({ error: "User already solved this question" });
//                     }
//                     res.status(200).json({
//                       message: "Correct Answer!",
//                     });
//                   }
//                 );
//               }
//             );
//           }
//         );
//       } else {
//         res.status(400).json({
//           message: "Wrong answer!",
//         });
//       }
//     }
//   );
// };

const scoreboard = (req, res) => {
  const currentScoreQuery =
    "SELECT user_name, user_score FROM users ORDER BY user_score DESC LIMIT 10";
  connection.query(currentScoreQuery, (err, result) => {
    if (err) {
      console.log("Error fetching scores:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Scores fetched:", result);
    res.json(result);
  });
};

module.exports = { sendQuestion, checkAnswer, scoreboard };
