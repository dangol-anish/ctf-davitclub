const express = require("express");
const router = express.Router();
const {
  sendQuestion,
  checkAnswer,
  scoreboard,
} = require("../controllers/dashboard.controller.js");

router.get("/", sendQuestion);
router.post("/answer", checkAnswer);
router.get("/scoreboard", scoreboard);
module.exports = router;
