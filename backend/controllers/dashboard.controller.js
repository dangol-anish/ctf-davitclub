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
  const checkAnswerQuery =
    "select question_points from questions where question_id=? and question_answer= ?";

  connection.query(
    checkAnswerQuery,
    [questionId, userAnswer],
    async (err, checkAnswerResult) => {
      if (err) {
        return res.status(500).json({ error: "Error checking answer" });
      }
      if (checkAnswerResult.length > 0) {
        // if point increase user score
        const getUserScoreQuery =
          "select user_score from users where user_id=?";

        connection.query(
          getUserScoreQuery,
          [userId],
          async (err, getUserScoreResult) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error getting user score" });
            }
            const userScoreValue =
              getUserScoreResult[0].user_score +
              checkAnswerResult[0].question_points;

            const updateUserPointsQuery =
              "update users set user_score=? where user_id=?";

            connection.query(
              updateUserPointsQuery,
              [userScoreValue, userId],
              async (err, getUserScoreResult) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Error getting user score" });
                }
                res.status(200).json("Score Updated!");
              }
            );
          }
        );
      } else {
        res.status(400).json("Wrong answer!");
      }
    }
  );
};

module.exports = { sendQuestion, checkAnswer };
